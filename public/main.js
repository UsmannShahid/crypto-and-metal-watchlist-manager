async function fetchDashboardData(category = '') {
  const tableBody = document.getElementById('watchlist-body')

  let url = '/api/assets'
  if (category) {
    url += `?category=${category}`
  }

  try {
    const response = await fetch(url)
    const data = await response.json()

    tableBody.innerHTML = ''

    data.forEach(asset => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${asset.id}</td>
        <td><strong>${asset.name}</strong></td>
        <td><code style="background:#eee; padding:2px 6px;">${asset.symbol}</code></td>
        <td>${asset.category}</td>
        <td>$${asset.price.toLocaleString()}</td>
      `
    tableBody.appendChild(row)
    });
  } catch (err) {
    console.error('Error fetching data from API:', err)
  }
}



document.getElementById('asset-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('asset-name').value;
  const symbol = document.getElementById('asset-symbol').value;
  const category = document.getElementById('asset-category').value;
  const price = document.getElementById('asset-price').value;

  try {

    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, symbol, category, price })
    });

    if (response.ok) {
      // Clear all inputs from form fields upon success
      document.getElementById('asset-form').reset();
      // Instantly refresh list rendering state to display the item
      fetchDashboardData();
    } else {
      const errorData = await response.json();
      alert(`Error saving entry: ${errorData.error}`);
    }
    
  } catch (error) {
    console.error('Network submission failure:', error);
  }
  })

fetchDashboardData();

