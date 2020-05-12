class CompareList {
    static count = 0;
    static symboleArray = [];
  
    constructor(data) {
      let div = document.getElementById("compareContainer");
      let buttonContainer = document.createElement("BUTTON");
      buttonContainer.classList.add("mx-2","my-2");
      buttonContainer.setAttribute("id", data.symbol);
      this.button = buttonContainer;
      this.id = div;
      this.data = data;
      this.link = document.getElementById("compareLink");
    }
  
    addCompare() {
  // add a button the compare div if there is less than 3 buttons
      if (CompareList.count < 3) {
        this.button.textContent = `${this.data.symbol}  \u274c`;
        this.id.classList.remove("disapear");
        this.button.classList.add("btn", "btn-primary");
        this.id.append(this.button);
        CompareList.count++;
        CompareList.symboleArray.push(this.data.symbol);
        let url = "./company.html?symbol=";
        // creating the special url fro comparaison of the companies
        for (let items of CompareList.symboleArray) {
          url += `${items},`;
        }
  
        url = url.substring(0, url.length - 1);
        this.link.href = url;
        this.link.textContent = `Compare ${CompareList.count} Elements`;
      }
  
    }
    deleteCompare(compareButton) {
  //delete a button from the compare div
      let symbolButton = document.getElementById(this.data.symbol);
  
      symbolButton.addEventListener("click", () => {
        symbolButton.parentNode.removeChild(symbolButton);
        CompareList.count--;
  
        CompareList.symboleArray = CompareList.symboleArray.filter(symbol => {
          return symbol !== this.data.symbol;
        });
        // creating the url neede with the list of companies updated
        let url = "./company.html?symbol=";
  
        for (let items of CompareList.symboleArray) {
          url += `${items},`;
        }
  
        if (CompareList.count === 0) {
          this.id.classList.add("disapear");
        }
  
        url = url.substring(0, url.length - 1);
        this.link.href = url;
        this.link.textContent = `Compare ${CompareList.count} Elements`;
        compareButton.classList.remove("pressed");
        compareButton.textContent = "Compare";
      });
  
    }
  }