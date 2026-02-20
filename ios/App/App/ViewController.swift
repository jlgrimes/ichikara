import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // Unlock ProMotion 120fps for the WKWebView on iPhone Pro / iPad Pro
        if #available(iOS 15.0, *) {
            webView?.preferredFrameRateRange = CAFrameRateRange(
                minimum: 60,
                maximum: 120,
                preferred: 120
            )
        }
    }
}
