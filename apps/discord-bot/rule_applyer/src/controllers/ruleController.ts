import { applyRulesForMember } from "../applyRule";

exports.applyRulesForMember = (req, res, next) => {
  
  applyRulesForMember(req.member).then(
    () => {
      res.status(201).json({
        message: 'Rule applied successfully!'
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
