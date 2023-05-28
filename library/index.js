const axios = require('axios');
const actianPortal = 'https://www.actian.com/company/careers/';

async function getActianCareerPage(){
  try{
    const response = await axios.get(actianPortal);
    return response.data;
  }catch (error) {
    console.error(error);
    return 0;
  }
}

function ProcessJobsList(careersData,deptOnly=0,department=null){
  try{
    let JobPattern = /<div class=.job-posting.*[\n]+.*?<\/div>/g;
    let JobMatches = careersData.match(JobPattern);
    let JobsList = JobMatches.length?JobMatches[0]:'';
    let DeptPattern =/(?<=<div.*?class="department">)(.*?)(?=<\/div>)/g;
    let DeptMatches = JobsList.match(DeptPattern);
    if(deptOnly){
      return {dept:DeptMatches};
    }else{
      //console.log(DeptMatches,'--res')
      let JobsPattern =/(?<=<div.*?class="job-name">)(.*?)(?=<\/div>)/g;
      let MyJobs=[];
      for(let dept in DeptMatches){
        let singleDeptPattern='<div class="department">'+DeptMatches[dept]+'*.*?</div></a></div></div></div>';
        let parseDeptPattern = new RegExp(singleDeptPattern,'g');
        //console.log(IdentifyDeptPattern,'--pattern')
        let Jobs = JobsList.match(parseDeptPattern);
        let JobsTagsStr = Jobs.length?Jobs[0]:'';
        let DeptsJobs = JobsTagsStr.match(JobsPattern);
        //console.log(DeptsJobs,'---jobs')
        let deptKey = DeptMatches[dept].replace(/ /g,"_").replace(/[\(\)]/g,"").toLowerCase();
        if(department && department==DeptMatches[dept]){
          return {jobs:DeptsJobs};
        }
        MyJobs.push({[deptKey]: DeptsJobs});
      }
      return {dept:DeptMatches,jobs:MyJobs};
    }
  }catch(e){
    console.error(e);
    return 0;
  }
}

module.exports={getActianCareerPage,ProcessJobsList};
