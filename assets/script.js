const mp = new MercadoPago('TEST-57dc2bf9-9b89-4c44-a015-5662b0d2936c', {
    locale: 'es-UY'
});

document.querySelector("#payment-btn").addEventListener("click", async () => {
    const data = {
        id: 1111,
        title: document.querySelector("#title").innerText,
        unit: document.querySelector("#unit").innerText,
        img: document.querySelector("#img").currentSrc,
        price: document.querySelector("#price").innerText,
    }
    console.log(data);
    try {
        const res = await fetch('http://localhost:3000/detail',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const response = await res.json();
        renderCheckoutButton(response.id);
    } catch (error) {
        console.error(error);
    }
});


function renderCheckoutButton(pref) {
    const bricksBuilder = mp.bricks();

    async function showComponent(bricksBuilder) {
        await bricksBuilder.create('wallet', 'button-checkout', {
            initialization: {
                preferenceId: pref,
                redirectMode: 'modal'
            }
        });
    }

    window.checkoutButton = showComponent(bricksBuilder);
}
