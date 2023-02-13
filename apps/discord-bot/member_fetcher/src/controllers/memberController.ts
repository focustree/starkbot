import { fetchMember } from "../fetchmember";

exports.fetchMember = (req, res, next) => {
  
  fetchMember(req.member).then(
    () => {
      res.status(201).json({
        message: 'Item saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};