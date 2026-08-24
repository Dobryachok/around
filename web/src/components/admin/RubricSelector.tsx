import { ADMIN_RUBRIC_GROUPS, ADMIN_RUBRICS } from '../../data/adminRubrics';
import styles from './RubricSelector.module.css';

interface RubricSelectorProps {
  value: string;
  onChange: (slug: string) => void;
}

export default function RubricSelector({ value, onChange }: RubricSelectorProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>Рубрика</span>
      <div className={styles.groups}>
        {ADMIN_RUBRIC_GROUPS.map((group) => {
          const rubrics = ADMIN_RUBRICS.filter((rubric) => rubric.group === group.id);
          if (rubrics.length === 0) {
            return null;
          }

          return (
            <div key={group.id} className={styles.group}>
              <div className={styles.groupTitle}>{group.title}</div>
              <div className={styles.options}>
                {rubrics.map((rubric) => (
                  <label key={rubric.slug} className={styles.option}>
                    <input
                      type="radio"
                      name="admin-rubric"
                      value={rubric.slug}
                      checked={value === rubric.slug}
                      onChange={() => onChange(rubric.slug)}
                    />
                    <span>{rubric.title}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
