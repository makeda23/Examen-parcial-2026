const list = document.querySelector('#list');

async function loadPage(page) {
  const res = await fetch(`/api/onepiece/characters?page=${page}&limit=10`);
  const characters = await res.json();
  list.innerHTML = '';                       // esborra l'anterior
  for (const c of characters) {
    const bounty = c.bounties.find(b => b.is_active);
    const card = document.createElement('article');
    card.innerHTML = `
      <img src="${c.image_url}" width="150">
      <h2>${c.name.en}</h2>
      <p>${bounty ? bounty.amount : 'Sense recompensa'}</p>`;
    list.append(card);
  }
}

loadPage(1);
