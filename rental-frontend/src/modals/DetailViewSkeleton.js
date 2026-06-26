import { useAppContext } from '../components/context/AppContext';
import styles from './DetailViewModal.module.css';
import skeleton from './DetailViewSkeleton.module.css';

export const DetailViewModalSkeleton = () => {

    const { setRentingDetails, setShouldShowDetailsModal } = useAppContext();
    const handleClose = () => { setRentingDetails(null); setShouldShowDetailsModal(false) };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>


                <button className={styles.closeBtn} onClick={handleClose}>
                    ✕
                </button>

                <div className={styles.carousel}>
                    <div className={`${styles.image} ${skeleton.skel}`} />
                </div>

                <div className={styles.body}>

                    <div className={styles.left}>
                        <div className={`${skeleton.skel} ${skeleton.title}`} />
                        <div className={`${skeleton.skel} ${skeleton.location}`} />

                        <div className={styles.stats}>
                            <div className={`${skeleton.skel} ${skeleton.stat}`} />
                            <div className={`${skeleton.skel} ${skeleton.stat}`} />
                        </div>

                        <div className={`${skeleton.skel} ${skeleton.desc}`} />

                        <div className={styles.dateInfo}>
                            <div className={`${skeleton.skel} ${skeleton.date}`} />
                            <div className={styles.dot}></div>
                            <div className={`${skeleton.skel} ${skeleton.date}`} />
                        </div>
                    </div>

                    <div className={styles.right}>
                        <div className={`${skeleton.skel} ${skeleton.price}`} />
                        <div className={`${skeleton.skel} ${skeleton.perSqm}`} />

                        <div className={styles.buttonsWrapper}>
                            <div className={`${skeleton.skel} ${skeleton.btn}`} />
                            <div className={`${skeleton.skel} ${skeleton.btn}`} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};