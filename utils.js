function calculateReputation(totalCorrect,index) {
    if (totalCorrect > 0 && index === 0) {
        return 'Royal Champion';
      } else if (totalCorrect > 0 && index === 1) {
        return 'Grand Warden';
      } else if (totalCorrect > 0 && index === 2) {
        return 'Sergeant Major';
      } else if(totalCorrect === 0 && index > 2){
        return 'Goblin';
      }
      else {
        return 'Sergant';
      }
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

module.exports = {calculateReputation,generateOTP};