import { post, postCategory, author } from "./post";
import { service } from "./service";
import { teamMember, salonPage } from "./team";
import { brandStory } from "./brandStory";
import { galleryItem, testimonial } from "./gallery";
import { siteSettings, legalPage } from "./siteSettings";

export const schemaTypes = [
  post,
  postCategory,
  author,
  service,
  teamMember,
  salonPage,
  brandStory,
  galleryItem,
  testimonial,
  siteSettings,
  legalPage,
];
