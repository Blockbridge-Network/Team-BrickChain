export interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  price: string;
  pricePerToken: string;
  tokensSold: number;
  images: string[];
  description: string;
  amenities: string[];
  tokenSupply: number;
  annualReturn: string;
  propertySize: string;
  yearBuilt: number;
}

export const propertyData: Property[] = [
  {
    id: "1",
    title: "Luxury Condo, New York",
    location: "Manhattan, NY",
    type: "Residential",
    price: "$2,500,000",
    pricePerToken: "$2,500",
    tokensSold: 70,
    images: [
      "/Houses/House1.jpg",
      "/Houses/House2.jpg",
      "/Houses/House3.jpg"
    ],
    description: "Premium luxury condo in the heart of Manhattan with stunning city views",
    amenities: ["Doorman", "Gym", "Pool", "Parking", "Terrace"],
    tokenSupply: 1000,
    annualReturn: "8.5%",
    propertySize: "2,200 sq ft",
    yearBuilt: 2020
  },
  {
    id: "2",
    title: "Beach Villa, Miami",
    location: "Miami Beach, FL",
    type: "Residential",
    price: "$4,100,000",
    pricePerToken: "$4,100",
    tokensSold: 45,
    images: [
      "/Houses/House4.jpg",
      "/Houses/House5.jpg",
      "/Houses/House6.jpg"
    ],
    description: "Beachfront villa with direct access to Miami Beach",
    amenities: ["Private Beach", "Pool", "Smart Home", "Security"],
    tokenSupply: 1000,
    annualReturn: "9.2%",
    propertySize: "4,500 sq ft",
    yearBuilt: 2019
  },
  {
    id: "3",
    title: "Office Building, London",
    location: "City of London, UK",
    type: "Commercial",
    price: "$7,800,000",
    pricePerToken: "$7,800",
    tokensSold: 25,
    images: [
      "/Houses/House7.jpg",
      "/Houses/House8.jpg",
      "/Houses/House9.jpg"
    ],
    description: "Prime office space in London's financial district",
    amenities: ["24/7 Access", "Meeting Rooms", "Parking", "Security"],
    tokenSupply: 1000,
    annualReturn: "10.5%",
    propertySize: "12,000 sq ft",
    yearBuilt: 2018
  },
  {
    id: "4",
    title: "Industrial Complex, Singapore",
    location: "Jurong, Singapore",
    type: "Industrial",
    price: "$5,200,000",
    pricePerToken: "$5,200",
    tokensSold: 60,
    images: [
      "/Houses/House10.jpg",
      "/Houses/House11.jpg",
      "/Houses/House1.jpg"
    ],
    description: "Modern industrial complex with excellent connectivity",
    amenities: ["Loading Bays", "Security", "Storage", "Office Space"],
    tokenSupply: 1000,
    annualReturn: "11.2%",
    propertySize: "25,000 sq ft",
    yearBuilt: 2021
  }
];
