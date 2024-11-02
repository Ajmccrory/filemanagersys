export interface Case {
    id: number;
    title: string;
    description: string;
    created_at: string;
    evidence?: Evidence[];
  }
  
  export interface Evidence {
    id: number;
    title: string;
    description: string;
    date_added: string;
    case_id: number;
  }
  
  export interface Person {
    id: number;
    name: string;
    role: string;
    case_id: number;
    facts?: PersonFact[];
  }
  
  export interface PersonFact {
    id: number;
    content: string;
    date_added: string;
    person_id: number;
  }
  
  export interface Organization {
    id: number;
    name: string;
    type: string;
    case_id: number;
  } 