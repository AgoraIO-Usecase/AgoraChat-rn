
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNChatCallkitSpec.h"

@interface ChatCallkit : NSObject <NativeChatCallkitSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ChatCallkit : NSObject <RCTBridgeModule>
#endif

@end
