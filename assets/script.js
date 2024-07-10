const mp = new MercadoPago('APP_USR-3fa91575-503e-476a-b21d-4f49cae39fa6', {
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
        const res = await fetch('https://mp-ecommerce-nodejs-ih36.onrender.com/detail',{
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
