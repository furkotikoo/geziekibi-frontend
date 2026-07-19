import {
  EmailTemplateEnum,
  LanguageEnum,
  PageTypeEnum,
  PublishStatusEnum,
  TourServiceTypeEnum,
} from "@/app/lib/enums";

export type ApiResponse<T = any> = ApiErrorResponse | ApiSuccessResponse<T>;

export interface ApiErrorResponse extends Response {
  errorType: ErrorType;
  errorMessage: string;
  errors: string[] | null;
  errorRaw: any;
  errorsValidation: ErrorValidation[] | null;
  stack?: string;
}
export type ErrorType =
  | "General"
  | "Raw"
  | "Validation"
  | "Unauthorized"
  | "BAD REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL SERVER ERROR"
  | "METHOD NOT ALLOWED"
  | "NOT FOUND"
  | "REQUEST TIMEOUT";
export type ErrorValidation = { [key: string]: string };

export interface ApiSuccessResponse<T> extends Response {
  message: string;
  data: T;
}
export type DeleteSuccessResponse = {};
export type Role = "ADMINISTRATOR" | "STANDARD";
export type UserSuccessResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  fullName: string;
  role: Role; // Adjust roles as necessary
  language: string; // e.g., "en-US", "tr-TR"
  profileImage: CloudinaryImage;
  address: UserAddress;
};
export type UserAddress = {
  secondEmail: string;
  website: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
};
export type LoginSuccessResponse = {
  accessToken: string;
  user: UserSuccessResponse;
};
export type SignupSuccessResponse = string;
export type TagSuccessResponse = { id: number; name: string };
export type TourPathSuccessResponse = { id: number; name: string };
export type TourCategorySuccessResponse = {
  id: number;
  name: string;
  description: Text;
  parent: TourCategorySuccessResponse;
  subCategories: TourCategorySuccessResponse[];
  uploadedPrimaryImages: CloudinaryImage[];
};
export type TourServiceSuccessResponse = {
  id: number;
  name: string;
  description: string;
  type: TourServiceTypeEnum;
  service: ServiceSuccessResponse;
};
export type ServiceSuccessResponse = {
  id: number;
  name: string;
  description: string;
};
export type CloudinaryImage = {
  originalName: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  createdAt: Date;
  order: number;
};
export type Catalog = {
  id: number;
  originalName: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  createdAt: Date;
  order: number;
  publishDate: Date;
  publishStatus: PublishStatusEnum;
};
export type Document = {
  id: number;
  originalName: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  createdAt: Date;
  order: number;
  publishDate: Date;
  publishStatus: PublishStatusEnum;
};
export type TourService = {
  id: number;
  type: TourServiceTypeEnum;
  service: ServiceSuccessResponse;
};
export type TourDailyPath = {
  id: number;
  name: string;
};
export type DailyVisitingPlace = {
  id: number;
  name: string;
};
export type TourDailyForm = {
  breakfast: string;
  lunch: string;
  dinner: string;
  description: string;
  dailyPaths: TourDailyPath[];
  dailyVisitingPlaces: DailyVisitingPlace[];
};
export type TourSuccessResponse = {
  id: number;
  title: string;
  spot: string;
  body: string;
  tourType: string;
  primaryImages: CloudinaryImage[];
  galleryImages: CloudinaryImage[];
  publishStatus: string;
  publishDate: Date;
  startDate: Date;
  endDate: Date;
  category: TourCategorySuccessResponse;
  prices: { name: string; description: string; price: number }[];
  tags: TagSuccessResponse[];
  tourServices: TourService[];
  dailyForms: TourDailyForm[];
  importantNotes: string;
};

export type TourListSuccessResponse = {
  id: number;
  title: string;
  spot: string;
  tourType: string;
  primaryImages: CloudinaryImage[];
  publishStatus: string;
  publishDate: Date;
  category: TourCategorySuccessResponse;
  prices: { name: string; description: string; price: number }[];
};
export type TourPriceSuccessResponse = {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  rowId: number;
};
export type TourDateSuccessResponse = {
  id: number;
  startDate: Date;
  endDate: Date;
  description: string;
  isActive: boolean;
  prices: TourPriceSuccessResponse[];
};
export type BlogCategorySuccessResponse = {
  id: number;
  name: string;
  description: Text;
  parent: TourCategorySuccessResponse;
  subCategories: TourCategorySuccessResponse[];
  uploadedPrimaryImages: CloudinaryImage[];
};
export type BlogSuccessResponse = {
  id: number;
  title: string;
  spot: string;
  body: string;
  language: LanguageEnum;
  publishStatus: string;
  publishDate: Date;
  category: BlogCategorySuccessResponse;
  tags: TagSuccessResponse[];
  uploadedPrimaryImages: CloudinaryImage[];
};

export type BlogListSuccessResponse = {
  id: number;
  title: string;
  spot: string;
  language: string;
  primaryImages: CloudinaryImage[];
  publishStatus: string;
  publishDate: Date;
  category: TourCategorySuccessResponse;
  tags: TagSuccessResponse[];
};

export type StaticPageSuccessResponse = {
  id: number;
  title: string;
  body: string;
  pageType: PageTypeEnum;
};

export type StaticPageListSuccessResponse = {
  id: number;
  title: string;
  pageType: PageTypeEnum;
};

export type ContactFormSuccessResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  fullName: string;
  agreeToTerms: boolean;
  isResponded: boolean;
  response?: string;
};

export type FAQSuccessResponse = {
  id: number;
  Question: string;
  Answer: string;
  Order: number;
};
export type HomepageSliderSuccessResponse = {
  id: number;
  isActive: boolean;
  order: number;
  image: CloudinaryImage;
};

export type EmailTemplateSuccessResponse = {
  id: number;
  subject: string;
  body: string;
  key: EmailTemplateEnum;
};

export type EmailTemplateListSuccessResponse = {
  id: number;
  key: EmailTemplateEnum;
};
