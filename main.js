import {quests, upgrades} from './items.js';

window.onload = () => {
  const table = {};
  table.items = document.querySelector('table.items > tbody')
  table.quests = document.querySelector('table.quests > tbody')
  table.upgrades = document.querySelector('table.upgrades > tbody')

  const updateItems = () => {
    const items = {}
    for (const unfinished of document.querySelectorAll('[data-finished="false"]')) {
      for (const material of unfinished.querySelectorAll('.material')) {
        const name = material.dataset.name;
        const count = Number(material.dataset.count);

        if (!items[name]) {
          items[name] = 0;
        }
        items[name] += count;
      }
    }

    const item_names = Object.keys(items).sort();
    table.items.innerHTML = '';
    for (const item of item_names) {
      const count = items[item];
      const row = table.items.insertRow();
      row.className = 'item';
      row.dataset.name = item;
      row.dataset.count = count;

      const nameCell = row.insertCell();
      nameCell.className = 'itemName';
      nameCell.innerText = item;

      const countCell = row.insertCell();
      countCell.className = 'itemCount';
      countCell.innerText = count;
    }
  }

  for (const quest of quests) {
    const finishedStr = `quest finished: ${quest.name}`;
    if (localStorage.getItem(finishedStr) === null) {
      localStorage.setItem(finishedStr, 'false');
    }
    const row = table.quests.insertRow();
    row.dataset.name = quest.name;
    row.dataset.finished = window.localStorage.getItem(finishedStr);
    row.className = 'quest';

    row.onclick = () => {
      if (row.dataset.finished === 'true') {
        row.dataset.finished = 'false';
        console.debug(`Quest [${quest.name}] marked as unfinished`);
      } else {
        row.dataset.finished = 'true';
        console.debug(`Quest [${quest.name}] marked as finished`);
      }
      window.localStorage.setItem(finishedStr, row.dataset.finished);
      updateItems();
    }

    const name = row.insertCell();
    name.className = 'questName';
    name.innerText = quest.name;

    const mats = row.insertCell();
    name.className = 'materials';
    const mat_list = document.createElement('ul');
    for (const mat of quest.mats) {
      const mat_entry = document.createElement('li');
      mat_entry.className = 'material';
      mat_entry.dataset.name = mat.name;
      mat_entry.dataset.count = mat.count;
      mat_entry.innerText = `${mat.name} x${mat.count}`;
      mat_list.appendChild(mat_entry);
    }
    mats.appendChild(mat_list);
  }

  for (const upgrade of upgrades) {
    const row = table.upgrades.insertRow();
    row.dataset.name = upgrade.name;
    row.className = 'upgrade';

    const name = row.insertCell();
    name.className = 'upgradeName';
    name.innerText = upgrade.name;

    for (const tier of [2, 3, 4]) {
      const finishedStr = `upgrade finished: ${upgrade.name} tier ${tier}`;
      if (localStorage.getItem(finishedStr) === null) {
        localStorage.setItem(finishedStr, 'false');
      }

      const tierCell = row.insertCell();
      tierCell.className = 'upgradeLevel';
      tierCell.dataset.finished = window.localStorage.getItem(finishedStr);
      tierCell.onclick = () => {
        if (tierCell.dataset.finished === 'true') {
          tierCell.dataset.finished = 'false';
          console.debug(`Upgrade ${tier} for [${upgrade.name}] marked as unfinished`);
        } else {
          tierCell.dataset.finished = 'true';
          console.debug(`Upgrade ${tier} for [${upgrade.name}] marked as finished`);
        }
        window.localStorage.setItem(finishedStr, tierCell.dataset.finished);
        updateItems();
      }

      const mat_list = document.createElement('ul');
      for (const mat of upgrade.tiers[tier]) {
        const mat_entry = document.createElement('li');
        mat_entry.className = 'material';
        mat_entry.dataset.name = mat.name;
        mat_entry.dataset.count = mat.count;
        mat_entry.innerText = `${mat.name} x${mat.count}`;
        mat_list.appendChild(mat_entry);
      }
      tierCell.appendChild(mat_list);
    }
  }

  updateItems();
};
