(async function(){
    // getting the companies to compare from the url
    const urlParams = new URLSearchParams(window.location.search);
    let symbols =urlParams.get('symbol');
    symbols=symbols.split(",");
    // creating a web page for each companies of the url
    for(let symbol of symbols){
    const compinfo= new CompanyInfo(document.getElementById(`main-container`));
    await compinfo.load(symbol);
    await compinfo.addChart(symbol);
    }
})();
