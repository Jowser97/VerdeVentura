export interface user_VV {
  _id_user_VV: number;
  name: string;
  username: string;
  password: string;
  email: string;
  cp: string;
  rol: string;
  points: number;
  _id_grupos_VV?: number;
  created: string;
  profileImage?: string;
}

export interface retos_VV {
  _id_retos_VV: string;
  description: string;
  howTo: string;
  suggestion?: string;
  verification?: string;
  pointsGiven?: number;
  urlImgDefault?: string;
}

export interface retos_user_VV {
  _username: string;
  _id_retos_VV: string;
  urlUploaded?: string;
  status?: boolean;
}

export interface grupos_VV {
  _id_grupos_VV: number;
  members: string;
  groupName: string;
  size: number;
  public: boolean;
  groupPass?: string;
}