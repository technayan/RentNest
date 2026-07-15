import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { isCategoryExist } from "../../utils/isCategoryExist";
import {
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
} from "./landlord.interface";

// Create Property
const createPropertyIntoDB = async (
  payload: ICreatePropertyPayload,
  userId: string,
) => {
  const { title, category, property_image, description, price, location } =
    payload;

  let category_id;

  if (category) {
    category_id = await isCategoryExist(category);
  }

  const newProperty = await prisma.property.create({
    data: {
      title,
      landlord_id: userId,
      category_id,
      property_image,
      description,
      price,
      location,
    },
  });

  return newProperty;
};

// Update Property
const updatePropertyIntoDB = async (
  payload: IUpdatePropertyPayload,
  propertyId: string,
  userId: string,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.landlord_id !== userId) {
    throw new Error("You don't have permission to edit this property!");
  }

  const {
    title,
    category,
    property_image,
    description,
    price,
    location,
    availability_status,
  } = payload;

  let category_id;

  if (category) {
    category_id = await isCategoryExist(category);
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: {
      title,
      category_id,
      property_image,
      description,
      price,
      location,
      availability_status,
    },
  });

  return updatedProperty;
};

// Delete Property
const deletePropertyFromDB = async (propertyId: string, userId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.landlord_id !== userId) {
    throw new Error("You dont't have permission to delete this property!");
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      isDeleted: true,
    },
  });
};

// Get Requests for LandLord
const getRequestsForLandLordFromDB = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlord_id: landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          name: true,
          email: true,
          phone: true,
          profile_photo: true,
        },
      },
      property: {
        select: {
          title: true,
          price: true,
        },
      },
      payment: {
        select: {
          status: true,
        },
      },
      review: {
        select: {
          rating: true,
          comment: true,
        },
      },
    },
  });

  console.log(requests);

  return requests;
};

// Change Request Status
const changeRequestStatusIntoDB = async (
  requestId: string,
  landLordId: string,
  status: RentalRequestStatus,
) => {
  const request = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      property: {
        include: {
          landLord: true,
        },
      },
    },
  });

  if (request.property.landlord_id !== landLordId) {
    throw new Error("You've no permission to update this request");
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: {
      status,
    },
    include: {
      tenant: {
        select: {
          name: true,
          email: true,
          phone: true,
          profile_photo: true,
        },
      },
      property: {
        select: {
          title: true,
          price: true,
        },
      },
    },
  });

  return updatedRequest;
};

export const landlordService = {
  createPropertyIntoDB,
  updatePropertyIntoDB,
  deletePropertyFromDB,
  getRequestsForLandLordFromDB,
  changeRequestStatusIntoDB,
};
