export interface Place { 
    lat: number, 
    lon: number, 
    tags: { 
        name: string, 
        "name:ml": string, 
        "name:fr": string, 
        "name:en": string, 
        amenity: string, 
        shop: string, 
        tourism: string, 
        office: string, 
        boundary: string, 
        leisure: string, 
        natural: string, 
        sport: string 
    } 
}