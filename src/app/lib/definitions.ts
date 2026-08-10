import { z } from "zod";
import {
  CurrencyEnum,
  EmailTemplateEnum,
  LanguageEnum,
  PageTypeEnum,
  PublishStatusEnum,
  TourServiceTypeEnum,
  TourTypeEnum,
} from "./enums";
import { LastName, ZipCode } from "@/Constant/constant";

export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long." }),
    email: z.string().email({ message: "Please enter a valid email" }).trim(),
    password: z
      .string()
      // .min(8, { message: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      // .regex(/[0-9]/, { message: "Contain at least one number." })
      // .regex(/[^a-zA-Z0-9]/, {
      //   message: "Contain at least one special character.",
      // })
      .trim(),
    passwordConfirm: z.string().trim(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });
export type SignupSchema = z.infer<typeof SignupFormSchema>;

export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  password: z.string({ message: "Please enter a valid password" }).trim(),
});
export type SigninSchema = z.infer<typeof SigninFormSchema>;

export const CreateTagFormSchema = z.object({
  name: z
    .string({ message: "Please enter valid tag name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
});
export type CreateTagSchema = z.infer<typeof CreateTagFormSchema>;

export const CreateTourPathFormSchema = z.object({
  name: z
    .string({ message: "Please enter valid path name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
});
export type CreateTourPathSchema = z.infer<typeof CreateTourPathFormSchema>;

export const CreateTourCategoryFormSchema = z.object({
  name: z
    .string({ message: "Please enter valid category name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  description: z.string().nullable().optional(),
  parentId: z.number().optional(),
  primaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
  uploadedPrimaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
});
export type CreateTourCategorySchema = z.infer<
  typeof CreateTourCategoryFormSchema
>;

export const CreateServiceFormSchema = z.object({
  name: z
    .string({ message: "Please enter valid service name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  description: z.string().nullable().optional(),
});
export type CreateServiceSchema = z.infer<typeof CreateServiceFormSchema>;

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

// Image Schema
export const SINGLE_IMAGE_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
      ].includes(file.type),
    { message: "Invalid image file type" }
  )
  .refine((file) => file.size <= fileSizeLimit, {
    message: "File size should not exceed 5MB",
  });
export type SINGLEIMAGESCHEMA = z.infer<typeof SINGLE_IMAGE_SCHEMA>;

// Document Schema
export const DOCUMENT_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type),
    { message: "Invalid document file type" }
  )
  .refine((file) => file.size <= fileSizeLimit, {
    message: "File size should not exceed 5MB",
  });
export type DOCUMENTSCHEMA = z.infer<typeof DOCUMENT_SCHEMA>;

export const MULTIPLE_IMAGE_SCHEMA = z
  .unknown()
  .transform((value) => {
    return value as FileList;
  })
  .refine((list) => list.length > 0, "No files selected")
  .refine((list) => list.length <= 5, "Maximum 5 files allowed")
  .transform((list) => Array.from(list))
  .refine(
    (files) => {
      const allowedTypes: { [key: string]: boolean } = {
        "image/jpeg": true,
        "image/png": true,
        "application/pdf": true,
        "application/msword": true,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          true,
      };
      return files.every((file) => allowedTypes[file.type]);
    },
    { message: "Invalid file type. Allowed types: JPG, PNG, PDF, DOC, DOCX" }
  )
  .refine(
    (files) => {
      return files.every((file) => file.size <= fileSizeLimit);
    },
    {
      message: "File size should not exceed 5MB",
    }
  );
export type MULTIPLEIMAGESCHEMA = z.infer<typeof MULTIPLE_IMAGE_SCHEMA>;

export const DailyFormFormSchema = z.object({
  id: z
    .preprocess(
      (value) => parseInt(value as string), // Convert to a number first
      z.number()
    )
    .optional(), // Primary key, autogenerated
  dailyPaths: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .optional(),
  dailyVisitingPlaces: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .optional(),
  breakfeast: z.string().optional(),
  lunch: z.string().optional(),
  dinner: z.string().optional(),
  description: z.string().optional(),
});
export type DailyFormSchema = z.infer<typeof DailyFormFormSchema>;

export const TourDateFormSchema = z.object({
  id: z
    .preprocess(
      (value) => parseInt(value as string), // Convert to a number first
      z.number()
    )
    .optional(), // Primary key, autogenerated
  description: z.string().optional(), // 'text' type is generally optional in validation
  startDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid start date format",
    })
  ),
  endDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid end date format",
    })
  ),
  prices: z.array(
    z.object({
      name: z.string({ message: "Price name required" }).trim(),
      price: z.preprocess(
        (value) => parseFloat(value as string),
        z.number().positive({ message: "Price amount must be positive" })
      ),
      currency: z.string().min(1, { message: "Currency is required" }),
      description: z.string().nullable().optional(),
    })
  ),
});
export type TourDateSchema = z.infer<typeof TourDateFormSchema>;

export const TourValidationFormSchema = z.object({
  id: z
    .preprocess(
      (value) => parseInt(value as string), // Convert to a number first
      z.number()
    )
    .optional(), // Primary key, autogenerated
  title: z.string().min(1, { message: "Title is required" }),
  spot: z.string().min(1, { message: "Spot is required" }),
  body: z.string().optional(), // 'text' type is generally optional in validation
  startDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid start date format",
    })
  ),
  endDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid end date format",
    })
  ),
  publishStatus: z
    .nativeEnum(PublishStatusEnum, { message: "Publish status required" })
    .default(PublishStatusEnum.DRAFT),
  tourType: z
    .nativeEnum(TourTypeEnum, { message: "Tour type required" })
    .default(TourTypeEnum.YURTICI),
  publishDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid publish date format",
    })
  ),
  primaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
  galleryImages: z.array(z.any()).optional(), // Allow an array of any file objects for gallery images
  uploadedPrimaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
  uploadedGalleryImages: z.array(z.any()).optional(), // Allow an array of any file objects for gallery images
  tags: z.array(z.object({ id: z.number() })).optional(), // Assuming `tags` are referenced by `id`
  // prices: z.array(
  //   z.object({
  //     name: z.string({ message: "Price name required" }).trim(),
  //     price: z.preprocess(
  //       (value) => parseFloat(value as string),
  //       z.number().positive({ message: "Price amount must be positive" })
  //     ),
  //     currency: z.string().min(1, { message: "Currency is required" }),
  //     description: z.string().optional(),
  //   })
  // ),
  category: z.object({
    id: z.number({ message: "Category is required" }),
    name: z.string().optional(),
  }),
  tourServices: z.array(
    z.object({
      id: z.preprocess(
        (value) => (typeof value === "string" ? parseInt(value) : value),
        z.number().optional()
      ),
      type: z.nativeEnum(TourServiceTypeEnum, {
        message: "Servie type required",
      }),
      service: z.object({
        id: z.preprocess(
          (value) => (typeof value === "string" ? parseInt(value) : value),
          z.number()
        ),
        name: z
          .string({ message: "dsada" })
          .min(1, { message: "Service name is required" }),
        // description: z.string().optional(),
      }),
    })
  ),
  dailyForms: z.array(DailyFormFormSchema), // Allow an array of any file objects for primary images
  tourDates: z.array(TourDateFormSchema), // Allow an array of any file objects for primary images
  importantNotes: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
});
export type TourValidationSchema = z.infer<typeof TourValidationFormSchema>;

export const CreateTourPriceFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ message: "Please enter valid category name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  price: z.preprocess(
    (value) => parseFloat(value as string), // Convert to a number first
    z
      .number({ message: "Price is required" })
      .positive({ message: "Price must be a positive number" })
  ),
  currency: z
    .nativeEnum(CurrencyEnum, { message: "Currency required" })
    .default(CurrencyEnum.TRY),
  description: z.string().nullable().optional(),
});
export type CreateTourPriceSchema = z.infer<typeof CreateTourPriceFormSchema>;

export const EditUserFormSchema = z.object({
  firstName: z
    .string({ message: "Please enter valid first name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  lastName: z
    .string({ message: "Please enter valid first name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  bio: z.string().trim().nullable().optional(),
  secondEmail: z
    .string()
    .email({ message: "Please enter a valid email" })
    .trim()
    .nullable()
    .optional(),
  website: z.string().trim().nullable().optional(),
  address: z.string().trim().nullable().optional(),
  city: z.string().trim().nullable().optional(),
  zipCode: z.string().trim().nullable().optional(),
  country: z.string().trim().optional(),
});
export type EditUserSchema = z.infer<typeof EditUserFormSchema>;

export const ChangePasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmNewPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordSchema = z.infer<typeof ChangePasswordFormSchema>;

export const CreateBlogCategoryFormSchema = z.object({
  name: z
    .string({ message: "Please enter valid category name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  description: z.string().trim().nullable().optional(),
  parentId: z.number().optional(),
  primaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
  uploadedPrimaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
});
export type CreateBlogCategorySchema = z.infer<
  typeof CreateBlogCategoryFormSchema
>;

export const BlogValidationFormSchema = z.object({
  id: z
    .preprocess(
      (value) => parseInt(value as string), // Convert to a number first
      z.number()
    )
    .optional(), // Primary key, autogenerated
  title: z.string().min(1, { message: "Title is required" }),
  spot: z.string().min(1, { message: "Spot is required" }),
  body: z.string(), // 'text' type is generally optional in validation
  publishStatus: z
    .nativeEnum(PublishStatusEnum, { message: "Publish status required" })
    .default(PublishStatusEnum.DRAFT),
  language: z
    .nativeEnum(LanguageEnum, { message: "Language is required" })
    .default(LanguageEnum.TR),
  publishDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid publish date format",
    })
  ),
  primaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
  uploadedPrimaryImages: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
  tags: z
    .array(z.object({ id: z.number(), name: z.string().optional() }))
    .optional(), // Assuming `tags` are referenced by `id`

  category: z.object({
    id: z.number({ message: "Category is required" }),
    name: z.string().optional(),
  }),
});
export type BlogValidationSchema = z.infer<typeof BlogValidationFormSchema>;

export const StaticPageValidationFormSchema = z.object({
  id: z
    .preprocess(
      (value) => parseInt(value as string), // Convert to a number first
      z.number()
    )
    .optional(), // Primary key, autogenerated
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string(), // 'text' type is generally optional in validation
  pageType: z.nativeEnum(PageTypeEnum, { message: "Page type is required" }),
});
export type StaticPageValidationSchema = z.infer<
  typeof StaticPageValidationFormSchema
>;

export const EditCatalogFormSchema = z.object({
  originalName: z
    .string({ message: "Please enter valid name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  publishStatus: z
    .nativeEnum(PublishStatusEnum, { message: "Publish status required" })
    .default(PublishStatusEnum.DRAFT),
  publishDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid publish date format",
    })
  ),
});
export type EditCatalogSchema = z.infer<typeof EditCatalogFormSchema>;

export const AddNewDateInputSchema = z.object({
  startDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid date format",
    })
  ),
  endDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid date format",
    })
  ),
});
export type AddNewDateSchema = z.infer<typeof AddNewDateInputSchema>;

export const CreateFAQFormSchema = z.object({
  Question: z
    .string({ message: "Please enter valid question" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  Answer: z.string().optional(),
  Order: z
    .number()
    .int()
    .transform((value) => Number(value)),
});
export type CreateFAQSchema = z.infer<typeof CreateFAQFormSchema>;

export const EditHomepageSliderFormSchema = z.object({
  order: z
    .number()
    .int()
    .transform((value) => Number(value)),
  isActive: z.boolean(),
  homepageSlider: z.array(z.any()).optional(), // Allow an array of any file objects for primary images
});
export type EditHomepageSliderSchema = z.infer<
  typeof EditHomepageSliderFormSchema
>;

export const EmailTemplateValidationFormSchema = z.object({
  id: z
    .preprocess(
      (value) => parseInt(value as string), // Convert to a number first
      z.number()
    )
    .optional(), // Primary key, autogenerated
  subject: z.string().min(1, { message: "Spot is required" }),
  body: z.string(), // 'text' type is generally optional in validation
  key: z.nativeEnum(EmailTemplateEnum, {
    message: "Email Template key required",
  }),
});
export type EmailTemplateValidationSchema = z.infer<
  typeof EmailTemplateValidationFormSchema
>;

export const CreateContactFormResponseFormSchema = z.object({
  response: z
    .string({ message: "Please enter valid answer" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
});
export type CreateContactFormResponseSchema = z.infer<
  typeof CreateContactFormResponseFormSchema
>;

export const EditDocumentFormSchema = z.object({
  originalName: z
    .string({ message: "Please enter valid name" })
    .min(3, { message: "Be at least 3 charactes long" })
    .trim(),
  publishStatus: z
    .nativeEnum(PublishStatusEnum, { message: "Publish status required" })
    .default(PublishStatusEnum.DRAFT),
  publishDate: z.preprocess(
    (value) => new Date(value as string),
    z.date({
      message: "Invalid publish date format",
    })
  ),
});
export type EditDocumentSchema = z.infer<typeof EditDocumentFormSchema>;
