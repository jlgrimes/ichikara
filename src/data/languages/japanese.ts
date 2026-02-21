import type { LanguageMeta, SOSCategory } from '../../types/language';
import type { Lesson } from '../curriculum';
import { CURRICULUM } from '../curriculum';
import { SOS_CATEGORIES } from '../sos';

export interface LanguageBundle {
  meta: LanguageMeta;
  curriculum: Lesson[];
  sosCategories: SOSCategory[];
}

export const JAPANESE: LanguageBundle = {
  meta: {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    script: 'CJK',
    available: true,
  },
  curriculum: CURRICULUM,
  sosCategories: SOS_CATEGORIES,
};
