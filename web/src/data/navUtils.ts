export const CONTACTS_SECTION_ID = 'contacts';

export function scrollToContacts() {
  document.getElementById(CONTACTS_SECTION_ID)?.scrollIntoView({ behavior: 'smooth' });
}

export function isInternalNavHref(href: string) {
  return href.startsWith('/') || href.startsWith('#');
}
