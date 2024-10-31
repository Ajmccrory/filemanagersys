export interface Case {
    id: number;
    title: string;
    description: string;
    date_created: string;
    file_path: string | null;
  }
  
  export interface Evidence {
    id: number;
    title: string;
    description: string;
    date_added: string;
    case_id: number;
  }
  
  export interface Entity {
    id: number;
    name: string;
    type: 'person' | 'organization';
    role?: string;
    case_id: number;
  }
  
  export interface PersonFact {
    id: number;
    content: string;
    person_id: number;
  }

  export interface PageParams {
    id: string;
  }