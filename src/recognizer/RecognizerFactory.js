/**
 * Created by padewitte on 04/07/16.
 */
(function (scope, logging) {
  var logger = logging.getLogger('recognizer');

  function RecognizerFactory() {

  }

  RecognizerFactory.create = function (type) {
    logger.debug("Creating a recognizer ", type);
    if ("Cdkv3RestShapeRecognizer" === type) {
      return Object.create(scope.Cdkv3RestShapeRecognizer.prototype);
    } else if ("Cdkv3RestMathRecognizer" === type) {
      return Object.create(scope.Cdkv3RestMathRecognizer.prototype);
    } else if ("Cdkv3RestAnalyzerRecognizer" === type) {
      return Object.create(scope.Cdkv3RestAnalyzerRecognizer.prototype);
    } else if("Cdkv3WSMathRecognizer" == type) {
      return Object.create(scope.Cdkv3WSMathRecognizer.prototype);
    } else {
      return Object.create(scope.Cdkv3RestTextRecognizer.prototype);
    }
  };

  scope.RecognizerFactory = RecognizerFactory;
}(MyScript, logging));