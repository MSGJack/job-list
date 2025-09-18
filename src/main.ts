import "./style.css";
import { jobs } from "./data";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="main">
  <header>
  <img class="mask" />
  </header>
  <div class="container">
    <div id='filtered-tags' class="hidden">
        <div class="tags"></div>
        <span class="clear">Clear</span>
    </div>
    <div id="card-list"> </div>
  </div>
  </div>
`;

type job = {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
  jobTags: string[];
};

let selectedTags: string[] = [];
const jobsBox = document.querySelector<HTMLDivElement>("#card-list");
const tagsBox = document.querySelector<HTMLDivElement>("#filtered-tags .tags")!;
const clearButton = document.querySelector<HTMLSpanElement>(
  "#filtered-tags .clear"
)!;

const filterBar = document.querySelector<HTMLDivElement>("#filtered-tags")!;

function displayFilter() {
  if (selectedTags.length === 0) {
    filterBar.classList.add("hidden");
  } else {
    filterBar.classList.remove("hidden");
  }
}

function filterType(jobs: job[], tags: string[]) {
  return jobs.filter((job) => {
    const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
    return tags.every((tag) => jobTags.includes(tag));
  });
}

function removeTag(tag: string) {
  selectedTags = selectedTags.filter((t) => t !== tag);
  displayFilter();
  displayJobs(filterType(jobs, selectedTags));
}

function addTag(tag: string) {
  if (!selectedTags.includes(tag)) {
    selectedTags.push(tag);

    displayFilter();

    const tagSpan = document.createElement("p");
    const tagSec = document.createElement("div");
    tagSec.classList.add("tag-sec");
    const tagRemove = document.createElement("button");
    tagRemove.classList.add("tag-remove");
    tagRemove.textContent = "X";
    tagSpan.textContent = tag;
    tagSpan.classList.add("selected-tags");

    tagRemove.addEventListener("click", () => {
      removeTag(tag);
      tagSec.remove();
    });
    tagSec.appendChild(tagSpan);
    tagSec.appendChild(tagRemove);
    tagsBox.appendChild(tagSec);
  }

  const updateNewTags = filterType(jobs, selectedTags);
  displayJobs(updateNewTags);
}

clearButton.addEventListener("click", () => {
  selectedTags = [];
  tagsBox.innerHTML = "";
  displayFilter();
  displayJobs(jobs);
});

function displayJobs(jobsToDisplay: job[]) {
  jobsBox!.innerHTML = "";

  jobsToDisplay.forEach((job) => {
    //creates card for each job
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    //steps up left side card that holds comapny name position, time and location
    const cardLeftDiv = document.createElement("div");
    cardLeftDiv.classList.add("card-left");
    //makes space for img
    const logoDiv = document.createElement("div");
    logoDiv.classList.add("logoDiv");
    const logoImg = document.createElement("img");
    logoImg.classList.add("logo");
    //sets up where job information is listed
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("info");
    const nameDiv = document.createElement("div");
    nameDiv.classList.add("name");
    const newFeature = document.createElement("div");
    newFeature.classList.add("newFeature");
    const positionDiv = document.createElement("div");
    positionDiv.classList.add("position");
    const locationTimeDiv = document.createElement("div");
    locationTimeDiv.classList.add("location-time");
    //div for job tool, role, level and languages
    const jobSkillsandLanguage = document.createElement("div");
    jobSkillsandLanguage.classList.add("language");

    //hr element that only appears on smaller screen
    const hrDiv = document.createElement("hr");

    logoImg.src = `${job.logo}`;
    logoImg.alt = "Comapny Logo";
    logoDiv.appendChild(logoImg);

    nameDiv.innerHTML = `<p>${job.company}</p>`;
    newFeature.innerHTML = `${job.new ? "<span class='new'>NEW!</span>" : ""} ${
      job.featured ? "<span class='featured'>FEATURED</span>" : ""
    }`;
    nameDiv.appendChild(newFeature);
    infoDiv.appendChild(nameDiv);

    positionDiv.innerHTML = `<h3>${job.position}</h3>`;
    infoDiv.appendChild(positionDiv);

    locationTimeDiv.innerHTML = `<p>${job.postedAt} <span class='dot'> </span> ${job.contract} <span class='dot'></span> ${job.location}</p>`;
    infoDiv.appendChild(locationTimeDiv);

    //matches how the languages/tools are layed out in the design
    const jobSkills = [...job.jobTags];

    jobSkills.forEach((skill) => {
      const p = document.createElement("p");
      p.classList.add("skills");
      p.textContent = skill;

      p.addEventListener("click", () => {
        addTag(skill);
      });
      jobSkillsandLanguage.appendChild(p);
    });

    cardLeftDiv?.appendChild(logoDiv);
    cardLeftDiv.appendChild(infoDiv);

    cardDiv.appendChild(cardLeftDiv);
    cardDiv.appendChild(hrDiv);
    cardDiv.appendChild(jobSkillsandLanguage);

    jobsBox?.appendChild(cardDiv);
  });
}

displayJobs(jobs);
displayFilter();

