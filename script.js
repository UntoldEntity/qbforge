

$(document).ready(function () {
let categories =   {"Literature":["American Literature", "British Literature", "Classical Literature", "European Literature", "World Literature", "Other Literature"],
                    "History":["American History", "Ancient History", "European History", "World History", "Other History"],
                    "Science":["Biology","Chemistry","Physics","Other Science"],
                    "Fine Arts":["Visual Fine Arts", "Auditory Fine Arts", "Other Fine Arts"]}
const difficulties = ["Middle School", "Easy High School", "Regular High School", "Hard High School", "National Highschool", "Easy College", "Medium College", "Regionals College", "Nationals College", "Open"]

const difficulties_cont = document.getElementById("dc");
const checkboxes = document.getElementById("sc");
const apiUrl = new URL("https://qbreader.org/api/query");
const question_count_slider = document.getElementById("question_count");
const question_count_label = document.getElementById("qc");
const loop_lim = 10;

var  question_count = 24

let lit_count = 6
let hist_count = 6
let sci_count = 6
let fa_count = 6

var generate_button = document.getElementById("generate")

var litSlider = document.getElementById("Literature");
var histSlider = document.getElementById("History");
var sciSlider = document.getElementById("Science");
var faSlider = document.getElementById("Fine Arts");

var litLabel = document.getElementById("lLit");
var histLabel = document.getElementById("lHist");
var sciLabel = document.getElementById("lSci");
var faLabel = document.getElementById("lFA");

let subcat_count = 0;

let lit = 50;
let hist = 50;
let sci = 50;
let fa = 50;

generate_button.addEventListener('click', () => {
    generate()
})


console.log(checkboxes)

i=0;
for (const [key, category] of Object.entries(categories)) {

    for (const value of Object.values(category)) {
        subcat_count++
        i++
        addCheckbox(value, i, checkboxes, true)
    }
}
i=100
for (const value of difficulties) {
    i++
    addCheckbox(value, i, difficulties_cont, false)
}

updatesliders()

question_count_slider.oninput = function() {
    question_count=parseInt(this.value)

    updatesliders()
}

litSlider.oninput = function() {
    lit = parseFloat(this.value);
    updatesliders()
}
histSlider.oninput = function() {
    hist = parseFloat(this.value);
    updatesliders()
}
sciSlider.oninput = function() {
    sci = parseFloat(this.value);
    updatesliders()
}
faSlider.oninput = function() {
    fa = parseFloat(this.value);
    updatesliders()
}

generate_button.pressed

generate()

function decimalsToPercentage(decimals) {
    // Calculate the sum of decimals
    const sum = decimals.reduce((acc, val) => acc + val, 0);

    // Convert decimals to percentages
    let percentages = decimals.map(decimal => Math.round(decimal * 100));

    // Calculate the sum of percentages
    const totalPercentage = percentages.reduce((acc, val) => acc + val, 0);

    // Adjust one of the percentages if necessary
    if (totalPercentage !== 100) {
        const difference = 100 - totalPercentage;
        // Find the index of the maximum or minimum value to adjust
        const indexToAdjust = difference > 0 ? percentages.indexOf(Math.max(...percentages)) : percentages.indexOf(Math.min(...percentages));
        percentages[indexToAdjust] += difference;
    }

    return percentages;
}
function questionsToLimit(counts) {

    // Calculate the sum of percentages
    var totalCount = counts.reduce((acc, val) => acc + val, 0);

    // Adjust one of the percentages if necessary
    if (totalCount !== question_count) {
        var difference = question_count - totalCount;
        console.log(difference, "dif")

        i = 0;
        j = 0;
        while (difference != 0) {
            j++
            counts[i] += (difference/Math.abs(difference))
            

            if (i >= counts.length ) { i = 0 }

            totalCount=0
            for (val of counts) {
                totalCount += val
                
            }
            difference = question_count - totalCount;

            console.log(difference/Math.abs(difference), question_count, totalCount, difference)
            console.log(counts)

            if (j > loop_lim || difference == 0){
                break;
            }

            i++
        }
    }

    return counts;
}
function updatesliders() {
    let total = (lit + hist + sci + fa)+1;

    question_count_label.innerHTML = `Tossup Count - ${question_count}`

    let perc_lit = lit/total; let perc_hist = hist/total; let perc_sci = sci/total; let perc_fa = fa/total;
    percentages = decimalsToPercentage([perc_lit, perc_hist, perc_sci, perc_fa])
    perc_lit = percentages[0], perc_hist = percentages[1], perc_sci = percentages[2], perc_fa = percentages[3]

    let litq = Math.round(question_count*(lit/total)); let histq = Math.round(question_count*(hist/total)); let sciq = Math.round(question_count*(sci/total)); let faq = Math.round(question_count*(fa/total))
    question_counts = questionsToLimit([litq,histq,sciq,faq])
    console.log(question_counts, "TTTTTTTTTTTTTT")
    lit_count = question_counts[0], hist_count=question_counts[1], sci_count=question_counts[2],fa_count = question_counts[3]

    console.log(perc_lit,perc_hist,perc_sci,perc_fa,perc_lit+perc_hist+perc_sci+perc_fa, "        ", litq, histq, sciq, faq, litq+histq+sciq+faq)

    litLabel.innerHTML = `Literature - ${perc_lit}% - ${lit_count} Questions`
    histLabel.innerHTML = `History - ${perc_hist}% - ${hist_count} Questions`
    sciLabel.innerHTML = `Science - ${perc_sci}% - ${sci_count} Questions`
    faLabel.innerHTML = `Fine Arts - ${perc_fa}% - ${fa_count} Questions`
}

function addCheckbox(name, i, container, pre_checked = true) {  
    {  
        $('<input />', {  type: 'checkbox',  id: `c${i}`, value: name, checked : pre_checked}).appendTo(container);
        $('<label />', {  'for': 'cb1', text: name, class:"slider_round" }).appendTo(container);
        $('<br/>').appendTo(container)

    }  
}  
// Make a GET request
async function get(url, settings){
    try {
        const response = await fetch(apiUrl);
        console.log(response)
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
} 

function addQuestion(data, bdata, i) {

    //console.log(data)
    //console.log(bdata)
    

    $( `<h3 class=\"added_qb\">${data["set"]["name"]} | ${data["category"]} | ${data["subcategory"]} | ${data["difficulty"]}<h3/>`).appendTo($(".results"))
    $( `<h3 class=\"added_qb\">Tossup #${i+1}<h3/>`).appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> QUESTION: </b>${data["question"]}<p/>`).appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> ANSWER: </b>${data["answer"]}<p/>`).appendTo($(".results"))
    $( "<h3 class=\"added_qb\">Bonuses<h3/>").appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> LEAD-IN: </b>${bdata["leadin"]}<p/>`).appendTo($(".results"))
    $( "<h4 class=\"added_qb\">Bonus #1<h4/>").appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> QUESTION: </b>${bdata["parts"][0]}<p/>`).appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> ANSWER: </b>${bdata["answers"][0]}<p/>`).appendTo($(".results"))
    $( "<h4 class=\"added_qb\">Bonus #2<h4/>").appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> QUESTION: </b>${bdata["parts"][1]}<p/>`).appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> ANSWER: </b>${bdata["answers"][1]}<p/>`).appendTo($(".results"))
    $( "<h4 class=\"added_qb\">Bonus #3<h4/>").appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> QUESTION: </b>${bdata["parts"][2]}<p/>`).appendTo($(".results"))
    $( `<p class=\"added_qb\"><b> ANSWER: </b>${bdata["answers"][2]}<p/>`).appendTo($(".results"))
    $( `<p class=\"added_qb\">~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~<p/>`).appendTo($(".results"))
}

async function generate() {

    old = document.getElementsByClassName("added_qb")

    for (item of old) {
        item.innerHTML = ""
    }


    let selected_difficulties = []
    for (let i = 1; i <= 10; i++) {
        let box = document.getElementById(`c${i+100}`)
        console.log(box, i)
        if(box.checked === true) {
            selected_difficulties.push(i)
        }
    }
    
    let selected_subcats = []
    for (let i = 1; i <= subcat_count; i++) {
        let box = document.getElementById(`c${i}`)
        console.log(box, i,'aa')
        if(box.checked === true) {
            selected_subcats.push(box.value)
        }
    }
    console.log(selected_subcats)

    apiUrl.search = new URLSearchParams({
        randomize: true,
        difficulties: selected_difficulties,
        subcategories: selected_subcats,
        maxReturnLength: 100
    });

    console.log(apiUrl)
    const data = await get(apiUrl);

    target_lit = lit_count
    target_hist = hist_count
    target_sci = sci_count
    target_fa = fa_count
    
    if (data) {
        question_ids = []
        i=0
        console.log(data["tossups"]["questionArray"])
        for (question of data["tossups"]["questionArray"]){
            valid = false
            let cate = question["category"]
            console.log(cate)
            if (target_lit > 0) {
                if (cate == "Literature"){
                    target_lit -= 1
                    valid = true
                }
            }
            if (target_hist > 0) {
                if (cate == "History"){
                    target_hist -= 1
                    valid = true
                }
            } 
            if (target_sci > 0) {
                if (cate == "Science"){
                    target_sci -= 1
                    valid = true
                }
            }
            if (target_fa > 0) {
                if (cate == "Fine Arts"){
                    target_fa -= 1
                    valid = true
                }
            } 
            console.log(target_lit,target_hist,target_sci,target_fa)
            if (valid) {
                question_ids.push(i)
            }
            i++
        }
        j=0
        question_ids.randomize
        console.log(question_ids.length)
        for (i of question_ids){
            addQuestion(data["tossups"]["questionArray"][i], data["bonuses"]["questionArray"][i], j)
            j++
        }
    }
}
});
