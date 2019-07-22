const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

class Parser{

    static serialize(object){
        return JSON.stringify(object, getCircularReplacer(), 4);
    }
}

module.exports = Parser;