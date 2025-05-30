'use server';

import * as icecastService from "@/lib/db/services/icecastActions";

export async function findConfigById(id: string) {
  return icecastService.findConfigById(id);
}

export async function findServerById(id: string) {
    return icecastService.findServerById(id);
}