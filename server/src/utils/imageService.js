// Utility to get specific, distinct images for categories
// Ensures visual excellence by avoiding generic placeholders

export const getCategoryImage = (category, specificTerm = '') => {
    // Unsplash Source is deprecated, using LoremFlickr for reliable keyword-based images
    const baseUrl = 'https://loremflickr.com/800/600/';

    // Clean the specific term to be URL friendly
    const term = specificTerm.toLowerCase().replace(/[^a-z0-9]/g, ',');
    const timestamp = new Date().getTime() + Math.random(); // Bust cache

    // Specific mappings for "Secondary Marketplace" (Fashion/Second Hand)
    if (category === 'Fashion' || category === 'Second Hand') {
        if (term.includes('shoe')) return `${baseUrl}shoes,sneakers?random=${timestamp}`;
        if (term.includes('cloth')) return `${baseUrl}clothing,fashion?random=${timestamp}`;
        if (term.includes('bag')) return `${baseUrl}handbag,leather?random=${timestamp}`;
        if (term.includes('jewel')) return `${baseUrl}jewelry,necklace?random=${timestamp}`;
        if (term.includes('watch')) return `${baseUrl}wristwatch,luxury?random=${timestamp}`;
        return `${baseUrl}fashion,outfit?random=${timestamp}`;
    }

    // Other categories
    switch (category) {
        case 'Food':
            if (term.includes('burger')) return `${baseUrl}burger?random=${timestamp}`;
            if (term.includes('pizza')) return `${baseUrl}pizza?random=${timestamp}`;
            if (term.includes('cafe') || term.includes('coffee')) return `${baseUrl}coffee?random=${timestamp}`;
            if (term.includes('biryani')) return `${baseUrl}biryani,curry?random=${timestamp}`;
            if (term.includes('bakery')) return `${baseUrl}bakery,cake?random=${timestamp}`;
            return `${baseUrl}restaurant,food?random=${timestamp}`;

        case 'Electronics':
            if (term.includes('mobile') || term.includes('phone')) return `${baseUrl}smartphone?random=${timestamp}`;
            if (term.includes('computer') || term.includes('laptop')) return `${baseUrl}laptop,tech?random=${timestamp}`;
            if (term.includes('camera')) return `${baseUrl}camera?random=${timestamp}`;
            return `${baseUrl}electronics,gadget?random=${timestamp}`;

        case 'Cinema':
            return `${baseUrl}cinema,movie?random=${timestamp}`;

        case 'Laundry':
            return `${baseUrl}laundry,washing?random=${timestamp}`;

        case 'Haircut':
        case 'Salon':
            if (term.includes('men') || term.includes('gent')) return `${baseUrl}barber?random=${timestamp}`;
            return `${baseUrl}salon,hairstyle?random=${timestamp}`;

        default:
            return `${baseUrl}shop,store?random=${timestamp}`;
    }
};

export const getBusinessLogo = (domain) => {
    if (!domain) return null;
    return `https://logo.clearbit.com/${domain}`;
};
