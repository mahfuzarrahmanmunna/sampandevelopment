// lib/projects.data.ts
export interface ProjectData {
  slug: string;
  status: "ongoing" | "completed";
  name: string;
  type: string;
  location: string;
  promise: string;
  description: string;
  image: string;
  gallery: string[];
  facts: { label: string; value: string }[];
  benefits: { title: string; desc: string }[];
  amenities: string[];
  mapUrl: string;
}

export const projects: ProjectData[] = [
  {
    slug: "sampan-metro-square",
    status: "ongoing",
    name: "Sampan Metro Square",
    type: "Residential",
    location: "Ashulia",
    promise: "Land & Tower Developments",
    description: "A land-share project on 12 katha in Ashulia for buyers who want a defined stake in land without buying a whole plot. Each buyer receives an undivided share, recorded in their name and backed by project documents.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop"
    ],
    facts: [
      { label: "Status", value: "Ongoing" },
      { label: "Location", value: "Ashulia" },
      { label: "Land Area", value: "12 Katha" },
      { label: "Configuration", value: "B+G+12" }
    ],
    benefits: [
      { title: "Legal Clarity", desc: "Documents before payment. Every buyer knows exactly what they own." },
      { title: "Prime Location", desc: "Strategically located in Ashulia with high growth potential." }
    ],
    amenities: ["Land Share", "Open to NRBs", "~1300 Sq Ft Apartment", "Site visits arranged"],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29212.0!2d90.40!3d23.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAshulia!5e0!3m2!1sen!2sbd!4v1620000000000"
  },
  {
    slug: "sampan-condominium",
    status: "ongoing",
    name: "Sampan Condominium",
    type: "Serviced Living",
    location: "Express Highway",
    promise: "A G+9 Building on the Highway",
    description: "Serviced apartments on 20 katha, right beside Express Highway Inn. Units are managed for rental income, and owners get access to Express Highway Inn and Sampan Trade Emporium next door.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    ],
    facts: [
      { label: "Status", value: "Ongoing" },
      { label: "Location", value: "Express Highway" },
      { label: "Land Area", value: "20 Katha" },
      { label: "Configuration", value: "G+9" }
    ],
    benefits: [
      { title: "Rental Income", desc: "Professionally managed units for hassle-free rental income." },
      { title: "Integrated Living", desc: "Direct access to adjacent hotel and commercial facilities." }
    ],
    amenities: ["Nine service apartment floors", "Rooftop drone land station", "Pool and gym", "Ground-floor car parking"],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29212.0!2d90.40!3d23.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sExpress%20Highway!5e0!3m2!1sen!2sbd!4v1620000000000"
  },
  {
    slug: "sampan-trade-emporium",
    status: "ongoing",
    name: "Sampan Trade Emporium",
    type: "Mixed-Use",
    location: "Express Highway",
    promise: "Shopping, Banking and Healthcare in One Building",
    description: "A B+LG+G+11 building on 20 katha beside Express Highway Inn. Showrooms and a food court sit at the bottom, banks and offices in the middle, a hospital and diagnostics floors above, along with doctors' chambers.",
    image: "https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?q=80&w=2070&auto=format&fit=crop"
    ],
    facts: [
      { label: "Status", value: "Ongoing" },
      { label: "Location", value: "Express Highway" },
      { label: "Land Area", value: "20 Katha" },
      { label: "Configuration", value: "B+LG+G+11" }
    ],
    benefits: [
      { title: "Diverse Footfall", desc: "Healthcare, retail and food court ensure daily captive audience." },
      { title: "Commercial Hub", desc: "Strategically positioned on the main highway corridor." }
    ],
    amenities: ["Parking over two levels", "Showrooms G-L3", "Foodcourt, Cinema, Gym & Spa L4", "Hospital & Chambers L7-L11"],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29212.0!2d90.40!3d23.89!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sExpress%20Highway!5e0!3m2!1sen!2sbd!4v1620000000000"
  }
];