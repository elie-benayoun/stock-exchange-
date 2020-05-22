class Marquee {
  constructor(container) {
    // creating all the html elements needed
    let valueContainer=document.createElement("SPAN");
    valueContainer.classList.add("value-container");
    let loadingText=document.createElement("DIV");
    loadingText.append("Charging");
    loadingText.classList.add("disapear","loading-price");
    let loading = document.createElement("DIV");
    loading.classList.add("text-success", "spinner-border");
    loading.setAttribute("role", "status");
    loadingText.append(loading);
    container.append(loadingText);
    container.append(valueContainer)
    this.marqueeContainer= container;
    this.valueContainer=valueContainer;
    this.loadingText=loadingText;
  }
  load() {
    this.loadingText.classList.remove("disapear");
    // receive the list of companies from the web
    fetch("https://financialmodelingprep.com/api/v3/company/stock/list?apikey=9e70ad8f1cbec848c988d1ae31230d7f")
      .then(response => {
        return response.json();
      })
      .then(data => {
        // show the list in the marquee on the html page
        for (let i = 0; i < data.symbolsList.length; i += 10) {
          let nameMarquee = document.createElement("span");
          let priceMarquee = document.createElement("span");
          nameMarquee.textContent = data.symbolsList[i].symbol;
          priceMarquee.textContent = `$${data.symbolsList[i].price}`;
          nameMarquee.classList.add("ml-4");
          priceMarquee.classList.add("positive-percentage");
          this.valueContainer.append(nameMarquee, priceMarquee);
          this.loadingText.classList.add("disapear");
        }
      });
  }
}
