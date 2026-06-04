import { StyleSheet, View } from 'react-native';

import { PlayfulColors } from '@/design/tokens';

function SmileyDot({ size = 6 }: { size?: number }) {
  return <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2 }]} />;
}

function StarDoodle() {
  return (
    <View style={styles.starWrap}>
      <View style={styles.starBody}>
        <View style={styles.starFace}>
          <View style={styles.starEyes}>
            <SmileyDot size={5} />
            <SmileyDot size={5} />
          </View>
          <View style={styles.starMouth} />
        </View>
      </View>
    </View>
  );
}

function CloudDoodle() {
  return (
    <View style={styles.cloud}>
      <View style={[styles.cloudPuff, styles.cloudPuffL]} />
      <View style={[styles.cloudPuff, styles.cloudPuffM]} />
      <View style={[styles.cloudPuff, styles.cloudPuffR]} />
      <View style={styles.cloudFace}>
        <View style={styles.starEyes}>
          <SmileyDot size={4} />
          <SmileyDot size={4} />
        </View>
        <View style={[styles.starMouth, styles.cloudMouth]} />
      </View>
    </View>
  );
}

export function PlayfulDoodleCluster({ compact }: { compact?: boolean }) {
  return (
    <View style={[styles.cluster, compact && styles.clusterCompact]}>
      <View style={styles.row}>
        <CloudDoodle />
        <StarDoodle />
      </View>
      {!compact ? (
        <View style={[styles.row, styles.rowOffset]}>
          <View style={styles.pizza} />
          <View style={styles.mug}>
            <View style={styles.mugLabel} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    gap: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  clusterCompact: {
    paddingVertical: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  rowOffset: {
    marginTop: 4,
  },
  dot: {
    backgroundColor: PlayfulColors.ink,
  },
  starWrap: {
    transform: [{ rotate: '12deg' }],
  },
  starBody: {
    width: 52,
    height: 52,
    backgroundColor: PlayfulColors.accentYellow,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: PlayfulColors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  starFace: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    gap: 3,
  },
  starEyes: {
    flexDirection: 'row',
    gap: 10,
  },
  starMouth: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: PlayfulColors.ink,
    backgroundColor: 'transparent',
  },
  cloud: {
    width: 64,
    height: 40,
    position: 'relative',
  },
  cloudPuff: {
    position: 'absolute',
    backgroundColor: PlayfulColors.accentYellow,
    borderWidth: 2.5,
    borderColor: PlayfulColors.ink,
  },
  cloudPuffL: {
    width: 28,
    height: 28,
    borderRadius: 14,
    left: 0,
    top: 8,
  },
  cloudPuffM: {
    width: 36,
    height: 36,
    borderRadius: 18,
    left: 16,
    top: 0,
  },
  cloudPuffR: {
    width: 24,
    height: 24,
    borderRadius: 12,
    right: 0,
    top: 12,
  },
  cloudFace: {
    position: 'absolute',
    left: 22,
    top: 14,
    alignItems: 'center',
    gap: 2,
  },
  cloudMouth: {
    width: 6,
    height: 6,
  },
  pizza: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDBA74',
    borderWidth: 2.5,
    borderColor: PlayfulColors.ink,
  },
  mug: {
    width: 32,
    height: 28,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: PlayfulColors.accentPurple,
    borderWidth: 2.5,
    borderColor: PlayfulColors.ink,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  mugLabel: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: PlayfulColors.onDark,
  },
});
