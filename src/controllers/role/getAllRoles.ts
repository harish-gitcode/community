import { Request, Response } from "express";
import {
  createDataResponse,
  createErrorResponse,
} from "../../utilities/createResponse.js";
import prisma from "../../utilities/prisma.js";
import { PaginationMetaData } from "../community/getAllCommunities.js";

const getAllRoles = async (_req: Request, res: Response) => {
  try {
    let currentPage = 1; //these two fields must come from frontend
    let pageSize = 3;

    const total = await prisma.role.count();
    const pages = Math.ceil(total / pageSize);
    const page = Math.min(Math.max(currentPage, 1), pages); // Ensure page is within valid range

    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    });

    const meta: PaginationMetaData = {
      total,
      pages,
      page,
    };
    return createDataResponse(res, roles, meta);
  } catch (err) {
    const error = err as Error;
    return createErrorResponse(res, error.message);
  }
};

export default getAllRoles;
