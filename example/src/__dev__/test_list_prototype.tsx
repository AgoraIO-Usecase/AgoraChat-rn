import * as React from 'react';
import {
  Animated,
  FlatList,
  PanResponder,
  PanResponderInstance,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LoadingRN } from 'react-native-chat-uikit';

const Item = (item: ItemType): JSX.Element => {
  // console.log('test:', id, first);
  return (
    <View
      style={[styles.item]}
      onLayout={(e) => {
        // console.log('test:item:target:', e.nativeEvent.target);
        // callback?.(Math.round(e.nativeEvent.layout.height));
        item.height = Math.round(e.nativeEvent.layout.height);
      }}
    >
      <Text style={styles.title}>{item.en}</Text>
      <Text style={styles.title}>{item.ch}</Text>
    </View>
  );
};

const renderItem = ({ item }: { item: ItemType }) => {
  console.log('test:renderItem:', item.en);
  return (
    <Item
      en={item.en}
      ch={item.ch}
      id={item.id}
      first={item.first}
      callback={item.callback}
    />
  );
};

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function TestListPrototype() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const initY = React.useRef(new Animated.Value(0)).current;
  const { height } = useWindowDimensions();
  const ref = React.useRef<FlatList>(null);
  // const [itemHeight, setItemHeight] = React.useState(0);
  const [lastChar, setLastChar] = React.useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setTimeout(() => setRefreshing(false), 2000);
    wait(2000).then(() => setRefreshing(false));
    return <LoadingRN size="large" />;
  }, []);

  const initData = (): ItemType[] => {
    const obj = {} as any;
    return COUNTRY.map((item, index) => {
      const i = item.lastIndexOf(' ');
      const en = item.slice(0, i);
      const ch = item.slice(i + 1);
      let first = false;
      if (obj[en.slice(0, 1)]) {
        first = false;
      } else {
        first = true;
        obj[en.slice(0, 1)] = true;
      }
      return { id: index, en: en, ch: ch, first: first } as ItemType;
    });
  };

  const usePanResponder = (
    translateY: Animated.Value
  ): PanResponderInstance => {
    return React.useRef(
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onPanResponderStart: (e, { moveY, y0, dy }) => {
          setIsMoving(true);
          dy >= 0 && translateY.setValue(dy);
          console.log('test:start:y:', dy, y0, moveY);
          console.log(
            'test:start:c',
            calculateIndex(y0),
            getChar(calculateIndex(y0))
          );
          const c = getChar(calculateIndex(y0));
          if (c) jumpToItem(c);
          e.preventDefault();
        },
        onPanResponderMove: (e, { moveY, y0, dy }) => {
          setIsMoving(true);
          dy >= 0 && translateY.setValue(dy);
          console.log('test:move:y:', dy, y0, moveY);
          const c = getChar(calculateIndex(moveY));
          if (c) jumpToItem(c);
          e.preventDefault();
        }, // Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
        onPanResponderRelease: (e, { moveY, y0, dy }) => {
          setIsMoving(false);
          dy >= 0 && translateY.setValue(dy);
          console.log('test:release:y:', dy, y0, moveY);
          e.preventDefault();
        },
      })
    ).current;
  };

  const padding = 100;
  const calculateIndex = (y0: number): number => {
    const AZH = height - 2 * padding;
    const unitH = AZH / (AZ.length - 1);
    const index = Math.round((y0 - padding) / unitH);
    return index;
  };
  const getChar = (index: number) => {
    return AZ[index];
  };

  const data = initData();
  const panResponder = usePanResponder(initY);

  // const refff = React.useRef<View>();

  const jumpToItem = (char: string) => {
    if (char) setLastChar(char);
    for (const item of data) {
      const first = item.first;
      const en = item.en[0];
      if (first === true && char === en) {
        console.log('test:jumpToItem:', item);
        ref.current?.scrollToIndex({ animated: true, index: item?.id! });
        break;
      }
    }
    // for (let index = 0; index < data.length; index++) {
    //   const element = data[index];
    //   ref.current?.scrollToIndex({ animated: true, index: element?.id! });
    //   break;
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={ref}
        data={data}
        renderItem={renderItem}
        onLayout={(e) => {
          console.log('test:list:height:', e.nativeEvent.layout.height);
        }}
        getItemLayout={(item, index) => {
          const height = item?.[index]?.height as number | undefined;
          // console.log('test:getItemLayout:height:', height);
          const h = height ? height : 79.666 + 20;
          // console.log('test:-------', h);
          const r = {
            length: h,
            offset: h * index,
            index: index,
          };
          // console.log('test:getItemLayout:', r);
          return r;
        }}
        keyExtractor={(item) => {
          // console.log('test:index:id:', index, item.id);
          // item.id = index;
          return item.id.toString();
        }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={(info) => {
          console.log('test:info:', info.distanceFromEnd);
        }}
        // stickyHeaderIndices={[0]}
      />
      <Animated.View
        style={styles.alphabetContainer}
        pointerEvents="box-none"
        {...panResponder.panHandlers}
      >
        <Pressable
          pointerEvents="box-only"
          style={{
            flex: 1,
            width: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'blue',
          }}
        >
          {AZ.split('').map((char) => {
            return (
              <Text
                style={[
                  styles.alphabetItem,
                  {
                    backgroundColor: lastChar === char ? 'red' : 'green',
                  },
                ]}
                key={char}
              >
                {char}
              </Text>
            );
          })}
        </Pressable>
      </Animated.View>
      {isMoving && (
        <View style={styles.char}>
          <Text>{lastChar}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
  },
  alphabetContainer: {
    position: 'absolute',
    right: 0,
    top: 100,
    bottom: 100,
    width: 40,
    // height: '100%',
    margin: 0,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    direction: 'rtl',
  },
  alphabetItem: {
    width: 10,
    flex: 1,
    display: 'flex',
    fontSize: 14,
    backgroundColor: 'green',
  },
  char: {
    flex: 1,
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 6,
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

type ItemType = {
  id: number;
  en: string;
  ch: string;
  first: boolean;
  callback?: (height: number) => void;
  height?: number;
};

const AZ = '*ABCDEFGHIJKLMNOPQRSTUVWXYZ#';

const COUNTRY = [
  'Angola 安哥拉',
  'Afghanistan 阿富汗',
  'Albania 阿尔巴尼亚',
  'Algeria 阿尔及利亚',
  'Andorra 安道尔共和国',
  'Anguilla 安圭拉岛',
  'Antigua and Barbuda 安提瓜和巴布达',
  'Argentina 阿根廷',
  'Armenia 亚美尼亚',
  'Ascension 阿森松',
  'Australia 澳大利亚',
  'Austria 奥地利',
  'Azerbaijan 阿塞拜疆',
  'Bahamas 巴哈马',
  'Bahrain 巴林',
  'Bangladesh 孟加拉国',
  'Barbados 巴巴多斯',
  'Belarus 白俄罗斯',
  'Belgium 比利时',
  'Belize 伯利兹',
  'Benin 贝宁',
  'Bermuda Is. 百慕大群岛',
  'Bolivia 玻利维亚',
  'Botswana 博茨瓦纳',
  'Brazil 巴西',
  'Brunei 文莱',
  'Bulgaria 保加利亚',
  'Burkina-faso 布基纳法索',
  'Burma 缅甸',
  'Burundi 布隆迪',
  'Cameroon 喀麦隆',
  'Canada 加拿大',
  'Cayman Is. 开曼群岛',
  'Central African Republic 中非共和国',
  'Chad 乍得',
  'Chile 智利',
  'China 中国',
  'Colombia 哥伦比亚',
  'Congo 刚果',
  'Cook Is. 库克群岛',
  'Costa Rica 哥斯达黎加',
  'Cuba 古巴',
  'Cyprus 塞浦路斯',
  'Czech Republic 捷克',
  'Denmark 丹麦',
  'Djibouti 吉布提',
  'Dominica Rep. 多米尼加共和国',
  'Ecuador 厄瓜多尔',
  'Egypt 埃及',
  'EI Salvador 萨尔瓦多',
  'Estonia 爱沙尼亚',
  'Ethiopia 埃塞俄比亚',
  'Fiji 斐济',
  'Finland 芬兰',
  'France 法国',
  'French Guiana 法属圭亚那',
  'Gabon 加蓬',
  'Gambia 冈比亚',
  'Georgia 格鲁吉亚',
  'Germany 德国',
  'Ghana 加纳',
  'Gibraltar 直布罗陀',
  'Greece 希腊',
  'Grenada 格林纳达',
  'Guam 关岛',
  'Guatemala 危地马拉',
  'Guinea 几内亚',
  'Guyana 圭亚那',
  'Haiti 海地',
  'Honduras 洪都拉斯',
  'Hongkong 香港',
  'Hungary 匈牙利',
  'Iceland 冰岛',
  'India 印度',
  'Indonesia 印度尼西亚',
  'Iran 伊朗',
  'Iraq 伊拉克',
  'Ireland 爱尔兰',
  'Israel 以色列',
  'Italy 意大利',
  'Ivory Coast 科特迪瓦',
  'Jamaica 牙买加',
  'Japan 日本',
  'Jordan 约旦',
  'Kampuchea (Cambodia ) 柬埔寨',
  'Kazakstan 哈萨克斯坦',
  'Kenya 肯尼亚',
  'Korea 韩国',
  'Kuwait 科威特',
  'Kyrgyzstan 吉尔吉斯坦',
  'Laos 老挝',
  'Latvia 拉脱维亚',
  'Lebanon 黎巴嫩',
  'Lesotho 莱索托',
  'Liberia 利比里亚',
  'Libya 利比亚',
  'Liechtenstein 列支敦士登',
  'Lithuania 立陶宛',
  'Luxembourg 卢森堡',
  'Macao 澳门',
  'Madagascar 马达加斯加',
  'Malawi 马拉维',
  'Malaysia 马来西亚',
  'Maldives 马尔代夫',
  'Mali 马里',
  'Malta 马耳他',
  'Mariana Is 马里亚那群岛',
  'Martinique 马提尼克',
  'Mauritius 毛里求斯',
  'Mexico 墨西哥',
  'Moldova, Republic of 摩尔多瓦',
  'Monaco 摩纳哥',
  'Mongolia 蒙古',
  'Montserrat Is 蒙特塞拉特岛',
  'Morocco 摩洛哥',
  'Mozambique 莫桑比克',
  'Namibia 纳米比亚',
  'Nauru 瑙鲁',
  'Nepal 尼泊尔',
  'Netheriands Antilles 荷属安的列斯',
  'Netherlands 荷兰',
  'New Zealand 新西兰',
  'Nicaragua 尼加拉瓜',
  'Niger 尼日尔',
  'Nigeria 尼日利亚',
  'North Korea 朝鲜',
  'Norway 挪威',
  'Oman 阿曼',
  'Pakistan 巴基斯坦',
  'Panama 巴拿马',
  'Papua New Cuinea 巴布亚新几内亚',
  'Paraguay 巴拉圭',
  'Peru 秘鲁',
  'Philippines 菲律宾',
  'Poland 波兰',
  'French Polynesia 法属玻利尼西亚',
  'Portugal 葡萄牙',
  'Puerto Rico 波多黎各',
  'Qatar 卡塔尔',
  'Reunion 留尼旺',
  'Romania 罗马尼亚',
  'Russia 俄罗斯',
  'Saint Lueia 圣卢西亚',
  'Saint Vincent 圣文森特岛',
  'Samoa Eastern 东萨摩亚(美)',
  'Samoa Western 西萨摩亚',
  'San Marino 圣马力诺',
  'Sao Tome and Principe 圣多美和普林西比',
  'Saudi Arabia 沙特阿拉伯',
  'Senegal 塞内加尔',
  'Seychelles 塞舌尔',
  'Sierra Leone 塞拉利昂',
  'Singapore 新加坡',
  'Slovakia 斯洛伐克',
  'Slovenia 斯洛文尼亚',
  'Solomon Is 所罗门群岛',
  'Somali 索马里',
  'South Africa 南非',
  'Spain 西班牙',
  'Sri Lanka 斯里兰卡',
  'St.Lucia 圣卢西亚',
  'St.Vincent 圣文森特',
  'Sudan 苏丹',
  'Suriname 苏里南',
  'Swaziland 斯威士兰',
  'Sweden 瑞典',
  'Switzerland 瑞士',
  'Syria 叙利亚',
  'Taiwan 台湾省',
  'Tajikstan 塔吉克斯坦',
  'Tanzania 坦桑尼亚',
  'Thailand 泰国',
  'Togo 多哥',
  'Tonga 汤加',
  'Trinidad and Tobago 特立尼达和多巴哥',
  'Tunisia 突尼斯',
  'Turkey 土耳其',
  'Turkmenistan 土库曼斯坦',
  'Uganda 乌干达',
  'Ukraine 乌克兰',
  'United Arab Emirates 阿拉伯联合酋长国',
  'United Kiongdom 英国',
  'United States of America 美国',
  'Uruguay 乌拉圭',
  'Uzbekistan 乌兹别克斯坦',
  'Venezuela 委内瑞拉',
  'Vietnam 越南',
  'Yemen 也门',
  'Yugoslavia 南斯拉夫',
  'Zimbabwe 津巴布韦',
  'Zaire 扎伊尔',
  'Zambia 赞比亚',
];
