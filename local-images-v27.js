/* Optimierte, beim Deployment geprüfte lokale Flakonbilder. */
for (const perfume of PERFUMES) {
  const path = './bottles/' + perfume.id + '.webp';
  if (!window.PW_META[perfume.id]) window.PW_META[perfume.id] = {};
  window.PW_META[perfume.id].img = path;
  const previous = (window.CORE_META || {})[perfume.id] || {};
  window.CORE_META[perfume.id] = {...previous, img:path, cats:previous.cats || window.PW_META[perfume.id].use || []};
}
