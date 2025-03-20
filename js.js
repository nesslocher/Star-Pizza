//Menuen
function updateMenu(menuData) {
    const menuContainer = document.querySelector("#menu .grid"); 

    if (!menuContainer) { 
        console.error("Kunne ikke finde menu-containeren i HTML.");
        return;
    }

    menuContainer.innerHTML = ""; 

    function createCategoryCard(categoryName, items) {
        const card = document.createElement("div");
        card.classList.add("card");

        let html = `      
            <h3>${categoryName}</h3>
            <ul>
                ${items.map(item => `
                    <li><strong>${item.name}</strong> - ${item.ingredients ? `${item.ingredients}, ` : ""}${item.price}</li>
                `).join('')}
            </ul>
        `;

        card.innerHTML = html;
        return card;
    }

    if (menuData.pizza && menuData.pizza.length > 0) {
        menuContainer.appendChild(createCategoryCard("Pizza", menuData.pizza));
    }
    if (menuData.pasta && menuData.pasta.length > 0) {
        menuContainer.appendChild(createCategoryCard("Pasta", menuData.pasta));
    }
    if (menuData.øvrigt && menuData.øvrigt.length > 0) {
        menuContainer.appendChild(createCategoryCard("Øvrigt", menuData.øvrigt));
    }
}

//Opdater bestillingen
function opdaterBestillingsMenu(menuData) {
    const madValgContainer = document.getElementById("mad-valg");
    madValgContainer.innerHTML = "";

    const allDishes = [...(menuData.pizza || []), ...(menuData.pasta || []), ...(menuData.øvrigt || [])];

    allDishes.forEach(dish => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${dish.name} - ${dish.price}"> ${dish.name} - ${dish.price}`;
        madValgContainer.appendChild(label);
        madValgContainer.appendChild(document.createElement("br"));
    });
}

//Liste over billeder
const retBilleder = {
    "Donugherita": "./Images/Bestilling/pizza1.webp",
    "Choco-Pepperoni": "./Images/Bestilling/pizza2.webp",
    "LasagNut": "./Images/Bestilling/LasagNut.webp",
    "Fritter med Donut-dip": "./Images/Bestilling/Fritter.webp",
    "Hvidløgsdonut": "./Images/Bestilling/hvidløgsDonut.webp",
    "Cola med Donut-skum": "./Images/Bestilling/Cola.webp"
};

const bestillingsForm = document.getElementById("bestillingsForm");

if (bestillingsForm) {
    bestillingsForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const valgteInputs = document.querySelectorAll("#mad-valg input:checked");
        const valgteRetter = Array.from(valgteInputs).map(input => input.value.split(" - ")[0]);

        if (valgteRetter.length === 0) {
            alert("Du skal vælge mindst én ret!");
            return;
        }

        const bekræftBestilling = confirm(`Du er ved at bestille:\n- ${valgteRetter.join("\n- ")}\n\nEr du sikker? 🤔`);

        if (bekræftBestilling) {
            alert(`Tak for din ordre!\n\nDu har bestilt:\n- ${valgteRetter.join("\n- ")}\n\nVores kokke græder lige nu. 😭🍩`);
        } else {
            alert("Bestilling annulleret. Måske vil du ændre noget? 😅");
        }
    });
}

//Parser
async function fetchMenu() { 
    try {
        const response = await fetch("JSON.JSON"); 
        if (!response.ok) throw new Error("Kunne ikke hente menuen");

        const menuData = await response.json(); 
        console.log("Hentet menu data:", menuData);

        updateMenu(menuData);  
        opdaterBestillingsMenu(menuData); 

    } catch (error) {
        console.error("Fejl under hentning af menu:", error);
        document.getElementById("mad-valg").innerHTML = "<p>Kunne ikke hente menuen. Prøv igen senere.</p>";
    }
}

//Tekst på samme måde
async function loadTekster() {
    try {
        const response = await fetch("tekst.json");

        if (!response.ok) throw new Error("Kunne ikke hente tekstdata");
        const tekster = await response.json();

        const path = window.location.pathname;
        const page = path.split("/").pop();

        if (page === "index.html" || page === "") {
            document.querySelector(".slide-section .bubbly-text").textContent = tekster.forside.overskrift;

            document.getElementById("info").textContent = tekster.forside.info;
            document.getElementById("levering").textContent = tekster.forside.levering;

            document.querySelector(".tilbud-section").innerHTML = `
                <h2>${tekster.forside.tilbudsOverskrift}<h2>
                <p>${tekster.forside.tilbud}</p>
            `;
        }

        else if (page === "om-os.html") {
            const overskriftElement = document.getElementById("om-overskrift");
            
            const beskrivelse1Element = document.getElementById("beskrivelse1");
            const beskrivelse2Element = document.getElementById("beskrivelse2");
            const beskrivelse3Element = document.getElementById("beskrivelse3");

            overskriftElement.textContent = tekster["omOs"].overskrift;
            
            beskrivelse1Element.textContent = tekster["omOs"].beskrivelse1;
            beskrivelse2Element.textContent = tekster["omOs"].beskrivelse2;
            beskrivelse3Element.textContent = tekster["omOs"].beskrivelse3;
        }

        else if (page === "anmeldelser.html") {
            document.querySelector(".content-section h1").textContent = tekster.anmeldelser.overskrift;
            document.getElementById("review-text").placeholder = tekster.anmeldelser.anmeldelsesFormularOverskrift;
            document.querySelector("#review-form button").textContent = tekster.anmeldelser.submitKnap;
        }

        else if (page ==="menu-bestilling.html") {
            document.querySelector(".slide-section .bubbly-text").textContent = tekster.forside.overskrift;
            document.getElementById("menuOverskrift").textContent = tekster.menuBestilling.menuOverskrift;
            document.getElementById("bestilOverskrift").textContent = tekster.menuBestilling.bestilOverskrift;
            document.getElementById("retterOverskrift").textContent = tekster.menuBestilling.retterOverskrift;
        }

    } catch (error) {
        console.error("Fejl ved hentning af tekster:", error);
    }
}

//DOM
document.addEventListener("DOMContentLoaded", () => {
    
    const path = window.location.pathname;
    const page = path.split("/").pop(); 

    if (page === "menu-bestilling.html") { /*sikrer at den kun henter menuen på rette html fil*/
        fetchMenu(); 
    }

    loadTekster(); 

    const section = document.querySelector(".slide-section");
    if (section) {
        const images = [
            "Images/img5.webp", 
            "Images/img2.webp", 
            "Images/img3.webp", 
            "Images/img4.webp", 
            "Images/img1.webp", 
            "Images/img6.webp"
        ];
        let lastIndex = 0;

        function createSlide(imageUrl, isFirst = false) {
            const slide = document.createElement("div");
            slide.style.position = "absolute";
            slide.style.top = "0";
            slide.style.left = isFirst ? "0" : "100%";
            slide.style.width = "100%";
            slide.style.height = "100%";
            slide.style.backgroundImage = `url(${imageUrl})`;
            slide.style.backgroundSize = "cover";
            slide.style.backgroundPosition = "center";
            slide.style.transition = isFirst ? "none" : "left 1s ease-in-out";

            if (isFirst) slide.classList.add("active-slide");
            section.appendChild(slide);
            return slide;
        }

        createSlide(images[lastIndex], true);

        function changeBg() {
            let index;
            do {
                index = Math.floor(Math.random() * images.length);
            } while (index === lastIndex);

            lastIndex = index;
            const newSlide = createSlide(images[index]);
            const oldSlide = section.querySelector(".active-slide");

            if (oldSlide) oldSlide.style.left = "-100%";
            newSlide.classList.add("active-slide");

            setTimeout(() => { newSlide.style.left = "0"; }, 10);
            setTimeout(() => { if (oldSlide) section.removeChild(oldSlide); }, 1000);
        }

        setInterval(changeBg, 5000);
    }

    //anmeldleser
    const form = document.getElementById("review-form");
    const reviewsContainer = document.getElementById("reviews-container");
    if (form && reviewsContainer) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("review-name").value.trim();
            const text = document.getElementById("review-text").value.trim();

            if (name && text) {
                const newReview = document.createElement("div");
                newReview.classList.add("review");
                newReview.innerHTML = `<p>"${text}" - ${name}</p>`;
                reviewsContainer.prepend(newReview);
                form.reset();
            } else {
                alert("Udfyld venligst både navn og anmeldelse.");
            }
        });
    }

    //Bestilling (pop uppen)
    const bestillingsForm = document.getElementById("bestillingsForm");
    if (bestillingsForm) {
        bestillingsForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const madValgContainer = document.getElementById("mad-valg");
            const valgteInputs = madValgContainer.querySelectorAll("input:checked");
            const valgteRetter = Array.from(valgteInputs).map(input => input.value);

            if (valgteRetter.length === 0) {
                alert("Du skal vælge mindst én ret!");
                return;
            }

            const bekræftBestilling = confirm(`Du er ved at bestille:\n- ${valgteRetter.join("\n- ")}\n\nEr du sikker?....`);
            alert(bekræftBestilling ? `Tak for din ordren\n\nDu bestilte:\n- ${valgteRetter.join("\n- ")}\n\nok` : "Forståeligt");
        });
    }
    
    
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("full-size-image");

    if (modal) {
        modal.addEventListener("click", function(event) {
            if (event.target !== modalImg) {
                modal.style.display = "none";
            }
        });
    } else {
        console.warn("Advarsel: 'image-modal' findes ikke i DOM'en.");
    }

    document.querySelectorAll(".side-images img").forEach(img => {
        img.addEventListener("click", function() {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

});
