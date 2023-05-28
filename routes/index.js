var express = require('express');
var router = express.Router();
const {getActianCareerPage,ProcessJobsList}= require('../library');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/departments', async (req, res, next) => {
  try {
    let careersData = await getActianCareerPage();
    let jobsResult = ProcessJobsList(careersData,1);
    if(jobsResult){
      res.status(200).json({status:200,departments:jobsResult.dept});
    }else{
      res.status(200).json({status:200,message:'No data available'});
    }
  } catch (error) {
    console.error(error);
  }
});

router.get('/jobs', async (req, res, next) => {
  try {
    let department = req.query.department;
    if(department){
      let careersData = await getActianCareerPage();
      let jobsResult = ProcessJobsList(careersData,0,department);
      if(jobsResult){
        res.status(200).json({status:200,jobs_list:jobsResult.jobs});
      }else{
        res.status(200).json({status:200,message:'No data available'});
      }
    }else{
      res.status(422).json({status:422,message:'Department field required'});
    }
  } catch (error) {
    console.error(error);
  }
});

router.get('/my-career', async (req, res, next) => {
  try {
    let careersData = await getActianCareerPage();
    let jobsResult = ProcessJobsList(careersData);
    if(jobsResult){
      res.status(200).json({status:200,department:jobsResult.dept,jobs_list:jobsResult.jobs});
    }else{
      res.status(200).json({status:200,message:'No data available'});
    }
    //res.render('actian', { content: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Internal server error'});
  }
});

module.exports = router;
