class CompanyInfo {
  static count = 0;
  constructor(container) {

    let mainContainer = document.createElement("DIV");
    mainContainer.classList.add("container","shadow-lg","p-3","mb-5","bg-white","rounded","m-3");
    let titleContainer = document.createElement("DIV");
    titleContainer.classList.add("title");
    let imageContainer = document.createElement("IMG");
    this.imageContainer = imageContainer;
    let symbolContainer = document.createElement("SPAN");
    this.symbolContainer = symbolContainer;
    symbolContainer.classList.add("mx-3");
    let nameContainer = document.createElement("SPAN");
    this.nameContainer = nameContainer;
    titleContainer.append(imageContainer, symbolContainer, nameContainer);
    let priceContainer = document.createElement("DIV");
    priceContainer.classList.add("my-5", "price");
    let stockPriceNameContainer = document.createElement("SPAN");
    stockPriceNameContainer.textContent = "Stock Price";
    let stockPriceValueContainer = document.createElement("SPAN");
    stockPriceValueContainer.classList.add("mx-2");
    this.stockPriceValueContainer = stockPriceValueContainer;
    let percentageContainer = document.createElement("SPAN");
    this.percentageContainer = percentageContainer;
    priceContainer.append(stockPriceNameContainer,stockPriceValueContainer,percentageContainer);
    let infoContainer = document.createElement("P");
    infoContainer.classList.add("informations");
    this.infoContainer = infoContainer;
    let linkContainer = document.createElement("A");
    linkContainer.classList.add("link");
    linkContainer.textContent = "Click here to acceed to the website";
    this.linkContainer = linkContainer;
    let loadingContainer = document.createElement("DIV");
    loadingContainer.classList.add("disapear","spinner-border","text-primary");
    loadingContainer.setAttribute("role", "status");
    this.loadingContainer = loadingContainer;
    let loadingTextContainer = document.createElement("SPAN");
    loadingTextContainer.classList.add("sr-only");
    loadingContainer.append(loadingTextContainer);
    let canvasContainer = document.createElement("CANVAS");
    this.canvasContainer = canvasContainer;
    mainContainer.append(titleContainer,priceContainer,infoContainer,linkContainer,loadingContainer,canvasContainer);
    container.append(mainContainer);
    container.append(mainContainer);

    if (CompanyInfo.count > 0) {
      document.getElementById("text-compare").classList.remove("disapear");
    }

    this.id = container;
    CompanyInfo.count++;

  }
  load(symbol) {

    this.loadingContainer.classList.remove("disapear");
    //fetching all the needed data
    fetch(`https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=9e70ad8f1cbec848c988d1ae31230d7f`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        //creating all the html elements needed 
        this.imageContainer.src = data.profile.image;
        this.symbolContainer.textContent = data.symbol;
        this.nameContainer.textContent = data.profile.companyName;
        this.stockPriceValueContainer.textContent = `$ ${data.profile.price}`;
        this.percentageContainer.textContent = data.profile.changesPercentage;
        let thenum = data.profile.changesPercentage.split("(");
        thenum = thenum[1].split(")");
        thenum = parseFloat(thenum[0]);

        if (thenum >= 0) {
          this.percentageContainer.classList.add("positive-percentage");
          this.percentageContainer.classList.remove("negative-percentage");
        } else {
          this.percentageContainer.classList.remove("positive-percentage");
          this.percentageContainer.classList.add("negative-percentage");
        }

        this.infoContainer.textContent = data.profile.description;
        this.linkContainer.href = data.profile.website;

      });
  }
  //creating the chart
  addChart(symbol) {
    let down = [];
    let up = [];
    //fetching the needed data for the chart
    fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=9e70ad8f1cbec848c988d1ae31230d7f`)
      .then(res => {
        return res.json();
      })
      .then(graphData => {

        for (let i = 0; i < graphData.historical.length; i++) {
          down.push(graphData.historical[i].date);
          up.push(graphData.historical[i].close);
        }
        
        var ctx = this.canvasContainer.getContext("2d");
        var chart = new Chart(ctx, {
          type: "line",

          data: {
            labels: down,
            datasets: [
              {
                label: "Stock price history",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: up
              }
            ]
          },
          options: {}
        });
        this.loadingContainer.classList.add("disapear");
      });
  }
}
