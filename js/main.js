
(async function(){
const form=new SearchForm(document.getElementById("container-up"));
const results=new SearchResults(document.getElementById("resultList"))
let marquee = new Marquee(document.getElementById("marqueeContainer"));
//create the marque
marquee.load();
// start the search
form.onSearch(function(company){
    // when the debounce fonction from the input is over
    results.renderResults(company,(CompanyInfo,compareButton)=>{
        const compare=new CompareList(CompanyInfo);
        // prevent from adding twice the same button to the compare div
        if (!document.getElementById(CompanyInfo.symbol)){
        compare.addCompare();
        compare.deleteCompare(compareButton);
        }
    })});
    
})()
