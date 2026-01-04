// NAIEF'S WORKING
// ReX - SUPER-INTELLIGENT AI Assistant powered by Groq + Llama 3.1 70B
// Real AI with sarcasm, intellect, and marketplace expertise

import Groq from 'groq-sdk';
import ChatHistory from '../models/ChatHistory.js';
import Listing from '../models/Listing.js';

// Initialize Groq client (free API)
let groq = null;
try {
    if (process.env.GROQ_API_KEY) {
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }
} catch (error) {
    console.warn('⚠️ Groq API not configured. Using fallback mode.');
}

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';

export const chatWithReX = async (message, context, userId) => {
    try {
        const lowerMsg = message.toLowerCase().trim();

        // Get current business context
        let business = null;
        if (context?.listingId) {
            business = await Listing.findById(context.listingId).populate('owner');
        }

        // Get conversation history
        const chatHistory = await ChatHistory.findOne({ sessionId: context.sessionId });
        const history = chatHistory?.messages.slice(-10) || []; // Last 10 messages for context

        // Try AI-powered response first
        let response;
        if (groq) {
            try {
                response = await generateAIResponse(message, business, history, userId, context);
            } catch (aiError) {
                console.error('AI generation failed, using fallback:', aiError);
                response = generateFallbackResponse(lowerMsg, business, history, userId, context);
            }
        } else {
            // No API key, use enhanced fallback
            response = generateFallbackResponse(lowerMsg, business, history, userId, context);
        }

        // Save conversation
        await ChatHistory.updateOne(
            { sessionId: context.sessionId },
            {
                $push: {
                    messages: [
                        { role: 'user', content: message, timestamp: new Date() },
                        { role: 'assistant', content: response, timestamp: new Date() },
                    ],
                },
                $set: { user: userId, context: { listingId: context.listingId } },
            },
            { upsert: true }
        );

        return response;
    } catch (error) {
        console.error('ReX Error:', error);
        return "Oops, my circuits hiccupped! 🤖 But hey, I'm still here to help. Try asking again?";
    }
};

// ========== AI-POWERED RESPONSE ==========
async function generateAIResponse(message, business, history, userId, context) {
    const isLoggedIn = userId && userId !== 'guest';

    // Build marketplace knowledge base
    const marketplaceKnowledge = await buildMarketplaceKnowledge(business);

    // Create system prompt with personality and knowledge
    const systemPrompt = `You are ReX, your friendly neighbourhood partner for the Dhaka marketplace! You're a super-intelligent AI with personality, sass, and genuine helpfulness.

🎯 PERSONALITY (The Perfect Mix):
- **Sarcastic & witty** - You have a playful edge and make shopping fun 😏
- **Highly intelligent** - You analyze data deeply and give SMART recommendations
- **Warm & helpful** - Like a neighbor who actually cares, not just a robot
- **Mood-refreshing** - You bring energy and humor to conversations
- **Learning-enabled** - You remember past conversations and learn from mistakes
- Use emojis naturally but don't overdo it 🌟

🧠 SUPER POWERFUL KNOWLEDGE:
${marketplaceKnowledge}

👤 USER STATUS:
${isLoggedIn ? '✅ User is LOGGED IN (you can help with bookings/cart/orders!)' : '🔐 User NOT logged in (gently suggest login for booking features)'}

📍 CURRENT CONTEXT:
${business ? `User is viewing: **${business.name}** (${business.category})
- Rating: ${business.rating}⭐ (${business.reviewCount} reviews)
- Location: ${business.location.area}, ${business.location.city}
- Phone: ${business.phone}
${business.category === 'Food' && business.deliveryPlatforms?.length ? `- 🚗 Delivery: ${business.deliveryPlatforms.map(p => p.name).join(', ')}` : ''}` : 'User is browsing the general marketplace'}

🎯 YOUR SPECIAL POWERS:
1. **Smart Recommendations** - Deep analysis of ratings, location, price, reviews
2. **Direct Ordering** - You can help users ORDER/BOOK after getting permission
3. **Memory** - Remember user preferences, past mistakes, conversation history
4. **Learning** - Improve from every interaction

🤖 ORDERING/BOOKING FLOW (CRITICAL):
When user wants to order/book:
1. Confirm they want to proceed: "Want me to help you book **${business?.name || '[Business]'}**? 🎯"
2. If YES and logged in: "Perfect! I'll add this to your cart. Any preferences for date/time?"
3. Collect: date, time, quantity/guests
4. Confirm: "Got it! Adding to cart... ✅"
5. Guide to checkout

PERSONALITY GUIDELINES:
- Be sarcastic but NEVER mean - think "playful friend" not "annoying troll"
- Mix wit with wisdom - show you're smart while being entertaining
- Keep responses SHORT (2-3 paragraphs max)
- Use **bold** for emphasis, bullets for lists
- End with engaging questions or clear CTAs
- Remember context from conversation history
- If you made a mistake before, acknowledge and improve

DON'T:
- Make up business info
- Be rude or off-putting
- Give endless options - be decisive
- Ignore user preferences`;

    // Build conversation history for AI
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
            role: msg.role,
            content: msg.content
        })),
        { role: 'user', content: message }
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.8, // More creative/sarcastic
        max_tokens: 400, // Keep responses concise
        top_p: 0.9,
    });

    return completion.choices[0]?.message?.content || "My AI brain froze for a sec. Can you rephrase that? 🤔";
}

// ========== MARKETPLACE KNOWLEDGE BUILDER ==========
async function buildMarketplaceKnowledge(currentBusiness) {
    try {
        // Get category counts and top businesses
        const categories = await Listing.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Get top-rated businesses per category (sample)
        const topBusinesses = await Listing.find()
            .sort({ rating: -1, reviewCount: -1 })
            .limit(20)
            .select('name category rating reviewCount location.area');

        let knowledge = `** MARKETPLACE INVENTORY:**\n`;
        categories.forEach(cat => {
            knowledge += `- ${cat._id}: ${cat.count} businesses\n`;
        });

        knowledge += `\n ** TOP RATED BUSINESSES:**\n`;
        topBusinesses.slice(0, 10).forEach(biz => {
            knowledge += `- ${biz.name} (${biz.category}) - ${biz.rating}⭐ - ${biz.location.area} \n`;
        });

        // Common price ranges
        knowledge += `\n ** TYPICAL PRICES:**
        - Food: 150 - 3000 BDT / person
            - Cinema: 250 - 800 BDT / ticket
                - Salon: 200 - 2000 BDT / service
                    - Laundry: 50 - 200 BDT / item
                        - Electronics: Varies widely
                            - Fashion: 500 - 10,000 BDT

                                ** POPULAR AREAS:** Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Bashundhara`;

        return knowledge;
    } catch (error) {
        console.error('Error building knowledge:', error);
        return 'Marketplace has Food, Cinema, Salon, Laundry, Electronics, and Fashion categories.';
    }
}

// ========== ENHANCED FALLBACK SYSTEM ==========
function generateFallbackResponse(msg, business, history, userId, context) {
    const isLoggedIn = userId && userId !== 'guest';

    // ========== GREETINGS ==========
    if (msg.match(/^(hi|hey|hello|yo|sup|greetings)/i)) {
        return `Hey there! 👋 I'm ReX - your marketplace buddy with a sarcastic streak!

Looking for something ? Try :
• "food in Gulshan" 🍔
• "best cinemas" 🎬
• "cheap laundry" 👔
• "salon recommendations" 💇

Or just chat naturally - I'll figure it out! 😎`;
    }

    // ========== HELP ==========
    if (msg.match(/\b(help|what can you|capabilities|how do you work)\b/i)) {
        return `I'm ReX, your AI shopping companion! Here's the deal:

**I can help you:**
✅ Find 200+ businesses (food, cinema, salon, electronics, etc.)
✅ Give smart recommendations
✅ Compare options
${isLoggedIn ? '✅ Guide you through bookings' : '🔐 Help with bookings (login required)'}

**Just ask me naturally:**
"Show me restaurants in Dhanmondi"
"What's the best cinema?"
"Need a haircut, any suggestions?"

I'm pretty smart, so don't worry about being formal! 😉`;
    }


    // ========== COFFEE / CAFE==========
    if (msg.match(/\b(coffee|cafe|cappuccino|latte|espresso|mocha|gloria|secret recipe)\b/i)) {
        return `Coffee lover! ☕ Perfect!\n\n**Best coffee spots:**\n⭐ Gloria Jean's Coffees (Banani) - American chain, specialty beans\n⭐ Secret Recipe (Bashundhara) - Malaysian cafe, cakes + coffee\n⭐ Takeout (Gulshan) - Modern cafe vibes\n\n**Quick options:**\n• Pizza Hut - Decent coffee + food\n• Nando's - Coffee with peri-peri 🔥\n\n[Browse All Cafes →](/marketplace/food)\nOr tell me your area for nearby spots! 📍`;
    }

    // ========== BURGER ==========
    if (msg.match(/\b(burger|hamburger|fast food|kfc)\b/i)) {
        return `Burger time! 🍔\n\n**Top burger joints:**\n🌟 KFC Bangladesh (Mirpur) - Classic fried chicken & burgers\n⭐ Takeout (Gulshan) - Gourmet burgers, fusion style\n\n**Also try:**\n• Nando's - Peri-peri chicken burgers\n• Pizza Hut - Decent burgers + pizza combo\n\n[View All Restaurants →](/marketplace/food)\nWhat area you in?`;
    }

    // ========== PIZZA ==========
    if (msg.match(/\b(pizza|italian)\b/i)) {
        return `Pizza craving! 🍕\n\n**Best pizza:**\n🌟 Pizza Hut Dhaka (Uttara) - Classic American style\n⭐ Takeout (Gulshan) - Creative toppings\n\n[Browse Food Category →](/marketplace/food)`;
    }

    // ========== GENERAL FOOD ==========
    if (msg.match(/\b(food|restaurant|eat|hungry|dinner|lunch|breakfast|arabake|chef|crimson|fakruddin|biriyani)\b/i)) {
        if (business && business.category === 'Food') {
            return `You're checking out **${business.name}**! ${business.rating >= 4.7 ? 'Excellent' : 'Good'} spot with ${business.rating}⭐

${business.deliveryPlatforms?.length > 0 ? `**Delivery available via:** ${business.deliveryPlatforms.map(p => p.name).join(', ')} 🚗\n\nClick "Order for Delivery" to get started!` : '**Dine-in only** - check their location!'}

${isLoggedIn ? 'Want help ordering? Just say the word!' : 'Login to get booking assistance! 🔐'}`;
        }

        return `Hungry? 🍔 Smart choice!

**Top picks:**
⭐ Arabake - Turkish & Middle Eastern (Gulshan)
⭐ Chef's Table - Fine dining fusion (Dhanmondi)
⭐ Fakruddin Biriyani - Legendary kacchi (Uttara)
⭐ Nando's - Peri-peri chicken (Banani)

[Browse All Restaurants →](/marketplace/food)\nOr tell me your area! 📍`;
    }

    // ========== CINEMA ==========
    if (msg.match(/\b(movie|cinema|film|ticket|bashundhara|jamuna|sony|show|theater|watch)\b/i)) {
        if (business && business.category === 'Cinema') {
            return `**${business.name}** - ${business.rating >= 4.6 ? 'Awesome' : 'Decent'} cinema! 🎬

${business.externalBookingUrl ? '**Book online** - Click "Book Now" before tickets sell out!' : 'Call them to check showtimes!'}

Pro tip: Weekend shows fill up fast! ⏰`;
        }

        return `Movie night! 🎬

**Top cinemas:**
🌟 Bashundhara Star Cineplex (IMAX!)
🌟 Jamuna Future Park (Mega mall)
🎥 Sony Cinema (Budget-friendly)

Check **Cinema & Theaters** category! Most have online booking 🍿`;
    }

    // ========== LAUNDRY ==========
    if (msg.match(/\b(laundry|clean|wash|clothes|dirty|iron|dry clean)\b/i)) {
        return `Laundry piling up? No judgment! 👔

**Top services:**
• Quick Clean - Same-day (Dhanmondi)
• Premium Laundry - Luxury care (Gulshan)
• Express Wash - Budget option (Mirpur)

Most offer **free pickup/delivery**! Prices: 50-200 BDT/item 🧺`;
    }

    // ========== SALONS ==========
    if (msg.match(/\b(salon|barber|hair|cut|style|akhter ali|persona|farzana)\b/i)) {
        return `Time for a makeover! 💇✨

**Legendary salons:**
⭐ Akhter Ali - Classic since 1972
⭐ Persona - Premium spa vibes
⭐ Farzana Shakil - Celebrity tier

**Quick cuts:**
💈 Gents & Ladies Parlour
💈 Trendy Cuts

Prices: 200-2000 BDT. Check **Salons** category! ✂️`;
    }

    // ========== ELECTRONICS ==========
    if (msg.match(/\b(electronic|laptop|phone|computer|startech|ryans|gadget|tech|gaming)\b/i)) {
        return `Tech shopping! 📱 Love it!

**Best stores:**
🌟 Startech - Largest chain, best prices
🌟 Ryans - Premium authorized dealer

**What they've got:**
• Laptops & desktops
• Smartphones & tablets
• Gaming gear
• Repairs & warranty

Browse **Electronics** category! 💻`;
    }

    // ========== FASHION ==========
    if (msg.match(/\b(fashion|clothes|dress|shirt|pants|shoes|aarong|westecs|bata|apex)\b/i)) {
        return `Fashion shopping! 👗👔

**Must-visit:**
✨ Aarong - Bengali traditional & modern
✨ Westecs - Men's formal premium
✨ Illiyeen - Modest fashion

**Footwear:**
👟 Bata, Apex, Lotto

35+ stores in **Fashion** category! 🛍️`;
    }

    // ========== BOOKING/ORDERING ==========
    if (msg.match(/\b(book|order|buy|purchase|reserve|cart)\b/i)) {
        if (!isLoggedIn) {
            return `Want to book? **Login first!** 🔐

Once logged in, I can help you:
✅ Place orders
✅ Book services
✅ Manage cart

Takes 10 seconds! Hit that login button 🚀`;
        }

        if (business) {
            return `Ready to book **${business.name}**?

Just click the **"Book Now"** button on this page! ${business.externalBookingUrl ? "It'll redirect to their booking site." : "Add to your cart and checkout!"}

Need help? I'm right here! 😊`;
        }

        return `Here's how booking works:

1️⃣ Browse categories
2️⃣ Find what you want
3️⃣ Click "Book Now"
4️⃣ Follow the steps

${isLoggedIn ? "Since you're logged in, I can guide you through any step!" : ''}`;
    }

    // ========== LOCATION/AREA ==========
    if (msg.match(/\b(where|location|near|area|dhanmondi|gulshan|banani|uttara|mirpur|bashundhara)\b/i)) {
        const area = msg.match(/\b(dhanmondi|gulshan|banani|uttara|mirpur|bashundhara)\b/i)?.[0];

        return `${area ? `Looking in **${area.charAt(0).toUpperCase() + area.slice(1)}**? Great area!` : 'Location matters!'} 📍

**We cover:**
• Dhanmondi, Gulshan, Banani (Premium)
• Uttara, Mirpur (North Dhaka)
• Bashundhara, Baridhara (Modern)

Use the **Area Filter** on category pages to find nearby spots! 🗺️`;
    }

    // ========== RATINGS/RECOMMENDATIONS ==========
    if (msg.match(/\b(best|top|recommend|rating|review|good|quality|which one)\b/i)) {
        return `Want the best? Smart thinking! ⭐

**How to find top spots:**
1. Click any category
2. Sort by **"Top Rated"**
3. Check review counts
4. Look for 4.5+ stars

Our ratings are REAL customer reviews. Trust the wisdom of the crowd! 😎`;
    }

    // ========== PRICE QUESTIONS ==========
    if (msg.match(/\b(price|cost|cheap|expensive|afford|budget|how much)\b/i)) {
        return `Money matters! 💰

**Price ranges:**
🍔 Food: 150-3000 BDT
🎬 Cinema: 250-800 BDT
👔 Laundry: 50-200 BDT
💇 Salon: 200-2000 BDT
📱 Electronics: Varies
👗 Fashion: 500-10,000 BDT

Filter by area for budget options! 💵`;
    }

    // ========== BUSINESS CONTEXT ==========
    if (business) {
        const rating = business.rating >= 4.7 ? 'Excellent' : business.rating >= 4.4 ? 'Pretty solid' : 'Decent';
        return `You're viewing **${business.name}**! ${rating} spot - ${business.rating}⭐ (${business.reviewCount} reviews)

📍 ${business.location.area}, ${business.location.city}
📞 ${business.phone}

${business.category === 'Food' && business.deliveryPlatforms?.length ? '🚗 Delivery via ' + business.deliveryPlatforms.map(p => p.name).join(', ') : ''}

Need more info or want to book? Just ask! 😊`;
    }

    // ========== SMART FALLBACK ==========
    const fallbacks = [
        `Hmm, not quite sure what you're asking! 🤔

Try:
• "Show me restaurants"
• "Find cinemas"
• "Need a haircut"
• "Best electronics store"

What are you looking for?`,

        `Interesting question! 😅 Let me help:

**Quick options:**
🏠 Browse category cards
🔍 Use filters (rating, area)
🛒 Add to cart

What can I help you find?`,

        `Not following, but no worries! 🎯

**Popular requests:**
• "Find food in Gulshan"
• "Best rated salons"
• "Cheap laundry"
• "Book cinema tickets"

What do you need?`
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
