function calculateReputation(totalCorrect) {
    if (totalCorrect >= 301) {
        return 'Grandmaster';
    } else if (totalCorrect >= 201) {
        return 'Master';
    } else if (totalCorrect >= 101) {
        return 'Sergeant';
    } else {
        return 'Warrior';
    }
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

module.exports = {calculateReputation,generateOTP};