import { prisma } from '../../database/prisma.js';
import { createError } from '../../middleware/errorHandler.js';

export const getPoojas = async (filters: { category?: string; mode?: string; search?: string }) => {
  const where: any = {};

  if (filters.category && filters.category !== 'all') {
    where.category = filters.category;
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { nameEn: { contains: q } },
      { nameMr: { contains: q } },
      { descriptionEn: { contains: q } },
      { descriptionMr: { contains: q } },
    ];
  }

  let poojas = await prisma.poojaCatalog.findMany({
    where,
    orderBy: { price: 'asc' },
  });

  if (filters.mode && filters.mode !== 'all') {
    poojas = poojas.filter((p) => {
      try {
        const modes: string[] = JSON.parse(p.modesJson);
        return modes.includes(filters.mode!);
      } catch {
        return true;
      }
    });
  }

  return poojas.map((p) => ({
    ...p,
    mode: p.modesJson ? JSON.parse(p.modesJson) : ['online', 'ashram'],
    benefits: p.benefitsJson ? JSON.parse(p.benefitsJson) : [],
    includedItems: p.includedItemsJson ? JSON.parse(p.includedItemsJson) : [],
  }));
};

export const getPoojaById = async (id: string) => {
  const pooja = await prisma.poojaCatalog.findUnique({
    where: { id },
  });

  if (!pooja) {
    throw createError(`Pooja service #${id} not found in Ashram catalogue`, 404, 'NOT_FOUND');
  }

  return {
    ...pooja,
    mode: pooja.modesJson ? JSON.parse(pooja.modesJson) : ['online', 'ashram'],
    benefits: pooja.benefitsJson ? JSON.parse(pooja.benefitsJson) : [],
    includedItems: pooja.includedItemsJson ? JSON.parse(pooja.includedItemsJson) : [],
  };
};
