class SearchForm{
    constructor(container){
        //creating all the needed elements
        let myInput=document.createElement("INPUT");
        let mybtn=document.createElement("BUTTON");
        let CompareContainer=document.createElement("DIV");
        let linkCompareContainer=document.createElement("A");
        linkCompareContainer.setAttribute("id","compareLink");
        CompareContainer.append(linkCompareContainer);
        let main=document.getElementById("main");
        CompareContainer.setAttribute("id","compareContainer");
        CompareContainer.classList.add("disapear");
        CompareContainer.classList.add("compare-container","py-2");
        myInput.classList.add("form-control");
        mybtn.classList.add("btn","btn-light");
        mybtn.textContent="Refresh";
        this.mybtn=mybtn;
        myInput.setAttribute("id","searchbar");
        myInput.setAttribute("type","text");
        myInput.setAttribute("placeholder","Search");
        myInput.setAttribute("arial-label","search");
        container.prepend(myInput,mybtn);
        main.prepend(CompareContainer);
        
    }
    onSearch(callback) {
        var urlParams = new URLSearchParams(window.location.search);
        const myInput=document.getElementById("searchbar");
          // if there is a query in the url the stock exchange search for this query
          if (urlParams.has("querry")) {
            myInput.value=urlParams.get("querry");
            doFetch();
          }

       // using the debounce function
        myInput.addEventListener("keyup", debounce(doFetch, 500));
        // reset the page when we click on the button
        this.mybtn.addEventListener("click",()=>{
          window.location.search=window.location.search;
        });
        //debounce function
        function debounce(debounceFunction, delay) {
            var timer = null;
            return function() {
              clearTimeout(timer);
              timer = setTimeout(function() {
                debounceFunction();
              }, delay);
            };
          }
          function doFetch(){
            // receive the list of companies from the web
            fetch("https://financialmodelingprep.com/api/v3/search?query=" +myInput.value + "&limit=10&exchange=NASDAQ&apikey=9e70ad8f1cbec848c988d1ae31230d7f")
            .then(response=>{
              return response.json()
            })
            .then(data=>{
              // calling the callback function with the needed data
              callback(data)
            })
            
          }
          
        
    }
}