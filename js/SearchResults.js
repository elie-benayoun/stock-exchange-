class SearchResults {
  constructor(container) {
    //creating come neede html elements
    let loading = document.createElement("DIV");
    loading.classList.add("disapear", "text-primary", "spinner-border");
    loading.setAttribute("role", "status");
    this.loading = loading;
    let textLoading = document.createElement("SPAN");
    textLoading.textContent = "loading";
    textLoading.classList.add("sr-only");
    loading.append(textLoading);
    document.getElementById("main").insertBefore(loading, container);
    this.id = container;
  }

  renderResults(data, callback) {
    //taking the value of the input and adding it to a querry of the url
    let search = document.getElementById("searchbar").value;
    var urlParams = new URLSearchParams(window.location.search);
    var url = window.location.href.split("?")[0];
    // shox the loading spinner
    this.loading.classList.remove("disapear");
    ModifyUrl(urlParams, url, search);
    this.id.innerText = "";

    if (data.length === 0) {
      //Showing error message if there is no results
      let list = document.createElement("LI");
      list.textContent = "Sorry there is no results";
      this.id.append(list);
      this.loading.classList.add("disapear");
    } else {
      let data2 = [];
      let urls = [];
      //fetching the needed data for the companies
      for (let i = 0; i < data.length; i = i + 3) {
        let urlToPush = `https://financialmodelingprep.com/api/v3/company/profile/${data[i].symbol}`;
        if (i + 1 < data.length) {
          urlToPush += `,${data[i + 1].symbol}`;
        }
        if (i + 2 < data.length) {
          urlToPush += `,${data[i + 2].symbol}`;
        }
        urls.push(urlToPush);
      }

      Promise.all(urls.map((u) => fetch(u)))
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((data1) => {
          let k = 0;
          data2 = data1;
          let sortedData = [];
          let h = 0;
          let l = 0;
          let push = true;
          for (let i = 0; i < data.length; i++) {
            h = 0;
            l = 0;
            push = true;
            let itemTopush = "";
            //sort the array to have everything in the same order for the two arrays
            while (itemTopush !== data[i].symbol) {
              if (h === data2.length) {
                sortedData.push({ changesPercentage: null, image: null });
                push = false;
                console.log("hello");
                break;
              }
              if (data2[h].companyProfiles) {
                itemTopush = data2[h].companyProfiles[l].symbol;
              } else {
                itemTopush = data2[h].symbol;
              }

              if (itemTopush !== data[i].symbol) {
                l++;
                if (data2[h].companyProfiles) {
                  if (l === data2[h].companyProfiles.length) {
                    h++;
                    l = 0;
                  }
                } else {
                  h++;
                }
              }
            }
            if (push === true) {
              if (data2[h].companyProfiles) {
                sortedData.push(data2[h].companyProfiles[l].profile);
              } else {
                sortedData.push(data2[h].profile);
              }
            }
          }
          // add the element to the html code
          data.map((data) => {
            let list = document.createElement("LI");
            let link = document.createElement("A");
            let symbolSearch = document.createElement("SPAN");
            symbolSearch.classList.add("symbol-list", "mx-2");
            let compareButton = document.createElement("BUTTON");
            compareButton.classList.add("btn", "btn-primary", "compare-button");
            compareButton.textContent = "Compare";
            highlightSearch(data, search, link, symbolSearch);
            link.href = "./company.html?symbol=" + data.symbol;
            list.append(link, symbolSearch);
            list.className = "list-style";
            this.loading.classList.remove("disapear");
            let image = document.createElement("IMG");
            let percentage = document.createElement("span");
            // verifying that the needed elements exist
            if (sortedData[k].image) {
              image.src = `${sortedData[k].image}`;
              image.classList.add("image-list-size");
            }
            if (sortedData[k].changesPercentage) {
              percentage.textContent = `${sortedData[k].changesPercentage}`;
              percentage.classList.add("symbol-list");

              let thenum = sortedData[k].changesPercentage.split("(");
              thenum = thenum[1].split(")");
              thenum = parseFloat(thenum[0]);
              if (thenum >= 0) {
                percentage.classList.add("positive-percentage");
                percentage.classList.remove("negative-percentage");
              } else {
                percentage.classList.remove("positive-percentage");
                percentage.classList.add("negative-percentage");
              }
            }

            list.prepend(image);
            list.append(percentage);
            this.loading.classList.add("disapear");
            list.append(compareButton);
            this.data = data2;
            list.append(compareButton);
            this.id.append(list);
            // detect when we click on compare bouton
            compareButton.addEventListener("click", () => {
              callback(data, compareButton);
              compareButton.classList.add("pressed");
              compareButton.textContent = "Selected";
            });

            k++;
            // make the button blue again if we delte the button from the compare div
            if (document.getElementById(data.symbol)) {
              compareButton.classList.add("pressed");
              compareButton.textContent = "Selected";
              document
                .getElementById(data.symbol)
                .addEventListener("click", () => {
                  compareButton.classList.remove("pressed");
                  compareButton.textContent = "Compare";
                });
            }
          });
        });
    }

    function ModifyUrl(urlParams, url, search) {
      //modifying the url to add querry and the search of the user
      if (urlParams.has("querry")) {
        urlParams.set("querry", search);
        window.history.pushState({}, document.title, url + "?" + urlParams);
      } else {
        urlParams.append("querry", search);
        window.history.pushState({}, document.title, url + "?" + urlParams);
      }
    }
    function highlightSearch(data, search, link, symbolSearch) {
      //highlight the text in yellow depending of the user's search
      let highlightText = document.createElement("SPAN");
      highlightText.classList.add("highlights");
      if (data.name) {
        search = search.toLowerCase();
        let nameToinclude = data.name;
        let newSearch = search.replace(/(^.)/, (m) => m.toUpperCase());
        let nameToincludeTable = nameToinclude.split(search);

        for (let k = 0; k < nameToincludeTable.length; k++) {
          let nameToincludeTableUpper = nameToincludeTable[k].split(newSearch);
          for (let m = 0; m < nameToincludeTableUpper.length; m++) {
            let nameToincludeupper = nameToincludeTableUpper[m].split(
              search.toUpperCase()
            );
            for (let o = 0; o < nameToincludeupper.length; o++) {
              link.append(nameToincludeupper[o]);
              highlightText.textContent = search.toUpperCase();
              if (o < nameToincludeupper.length - 1) {
                link.append(highlightText.cloneNode(true));
              }
            }
            highlightText.textContent = newSearch;
            if (m < nameToincludeTableUpper.length - 1) {
              link.append(highlightText.cloneNode(true));
            }
          }
          highlightText.textContent = search;
          if (k < nameToincludeTable.length - 1) {
            link.append(highlightText.cloneNode(true));
          }
        }
      }

      highlightText.textContent = search.toUpperCase();
      let symbolToInclude = data.symbol;
      symbolToInclude = symbolToInclude.split(search.toUpperCase());

      for (let k = 0; k < symbolToInclude.length; k++) {
        symbolSearch.append(symbolToInclude[k]);

        if (k < symbolToInclude.length - 1) {
          symbolSearch.append(highlightText.cloneNode(true));
        }
      }
    }
  }
}
