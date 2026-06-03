import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { demoCategories, isSchemaMissingError } from '../data/demoContent.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      if (isSchemaMissingError(error)) {
        return res.json({
          ok: true,
          count: demoCategories.length,
          categories: demoCategories,
        });
      }

      throw error;
    }

    return res.json({
      ok: true,
      count: data.length,
      categories: data,
    });
  } catch (error) {
    return next(error);
  }
});
