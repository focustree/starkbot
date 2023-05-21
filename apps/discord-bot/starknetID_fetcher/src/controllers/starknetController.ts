import { fetchStarknetIdsForMember } from "../fetchSIDmember"

exports.getSID = (req, res, next) => {
  
  fetchStarknetIdsForMember(req.discordMemberId).then(
    (id) => {
      res.status(200).json({
        message: 'Starknet ID fetched successfully!',
        starknetID: id
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