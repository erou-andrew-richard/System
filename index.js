if (localStorage.getItem("Splash") === "False" ) {

   
    
} else {

   
    
}

fetch("./Test/Test.json")
.then(res =>res.json())
.then(data =>{
    data.forEach(element => {
        fetch(element.Path+element.Page)
            .then(res =>res.text())
            .then(data =>{
                localStorage.setItem(element.Name,data);
            })
            .catch(error =>console.log(error))

            fetch(element.Path+element.Styles)
            .then(res =>res.text())
            .then(data =>{
                localStorage.setItem(element.Name+"Styles",data);
            })
            .catch(error =>console.log(error))

            fetch(element.Path+element.Functions)
            .then(res =>res.text())
            .then(data =>{
                localStorage.setItem(element.Name+"Functions",data);
            })
            .catch(error =>console.log(error))
            
        });

    })
.catch(error =>console.log(error))

// Fetch The Source Code

fetch("./Library/Functions.js")
.then(res=>res.text())
.then(data =>{
    localStorage.setItem("Fun",data)
} )
.catch(error =>console.log(error))

// Call the Functions
ROUTECSS(localStorage.getItem("HomeStyles"));
ROUTEJS(localStorage.getItem("Fun"));

function navigate() {
    // Prepare state
    const pageData = { page, backPage: pageBack };

    // Determine history: push first, replace subsequent navigations
    if (history.state && history.state.backPage) {
        history.replaceState(pageData, "", `?page=${page}`);
    } else {
        history.pushState(pageData, "", `?page=${page}`);
    }

    // Save current page and back page
    sessionStorage.setItem("pageName", page);
    sessionStorage.setItem("backpageName", pageBack);

    // --- Helper functions ---

    // Inject JS safely (IIFE + cleanup)
    function ROUTEJS(jsCode) {
        // Remove all previously injected dynamic scripts
        document.querySelectorAll("script.dynamic-script").forEach(s => s.remove());

        const script = document.createElement("script");
        script.className = "dynamic-script";
        script.textContent = `(function(){ ${jsCode} })();`;
        document.body.appendChild(script);
    }

    // Inject CSS safely (cleanup old dynamic styles)
    function ROUTECSS(cssCode) {
        document.querySelectorAll("style.dynamic-style").forEach(s => s.remove());

        const style = document.createElement("style");
        style.className = "dynamic-style";
        style.textContent = cssCode;
        document.head.appendChild(style);
    }

    // Render page from localStorage
    const html = localStorage.getItem(page);
    const css = localStorage.getItem(page + "Styles");
    const js = localStorage.getItem(page + "Functions");

    if (html) document.body.innerHTML = html;
    if (css) ROUTECSS(css);
    if (js) ROUTEJS(js);

    // --- Handle back/forward ---
    window.onpopstate = (event) => {
        const state = event.state;
        const backPageStored = sessionStorage.getItem("backpageName");

        let popPage;
        if (state && state.page) {
            popPage = (state.page === backPageStored) ? state.page : backPageStored || state.page;
        } else {
            popPage = backPageStored || "Home";
        }

        sessionStorage.setItem("pageName", popPage);

        const html = localStorage.getItem(popPage);
        const css = localStorage.getItem(popPage + "Styles");
        const js = localStorage.getItem(popPage + "Functions");

        if (html) document.body.innerHTML = html;
        if (css) ROUTECSS(css);
        if (js) ROUTEJS(js);
    };
};

navigate("Home","Home");