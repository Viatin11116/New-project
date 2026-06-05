/*
File Name    : AT11.sql
Student ID   : 35823194
Student Name : Jiaxu Dong
Last Modified: 25 May 2026
Purpose      : Applied Task 11
Notes        : Assumes customers who have completed training are recorded in
               DRONE.CUST_TRAIN and completed rentals are those with a
               non-null RENT_IN_DT in DRONE.RENTAL.
*/

SPOOL AT11-run.txt

SET ECHO ON
SET PAGESIZE 100
SET FEEDBACK ON
SET LINESIZE 200

COLUMN cust_id            FORMAT 9999   HEADING 'CUST_ID'
COLUMN customer_name      FORMAT A35    HEADING 'CUSTOMER_NAME'
COLUMN courses_completed  FORMAT 999    HEADING 'COURSES_COMPLETED'
COLUMN rentals_completed  FORMAT 999    HEADING 'RENTALS_COMPLETED'
COLUMN percent_all_rentals FORMAT A20   HEADING 'PERCENT_ALL_RENTALS'

WITH trained_customers AS (
    SELECT
        c.cust_id,
        UPPER(c.cust_fname) || ', ' || INITCAP(c.cust_lname) AS customer_name,
        COUNT(DISTINCT ct.ct_id) AS courses_completed
    FROM drone.customer c
    JOIN drone.cust_train ct
        ON c.cust_id = ct.cust_id
    GROUP BY
        c.cust_id,
        UPPER(c.cust_fname) || ', ' || INITCAP(c.cust_lname)
),
completed_rentals AS (
    SELECT
        ct.cust_id,
        COUNT(*) AS rentals_completed
    FROM drone.rental r
    JOIN drone.cust_train ct
        ON r.ct_id = ct.ct_id
    WHERE r.rent_in_dt IS NOT NULL
    GROUP BY
        ct.cust_id
),
total_completed_rentals AS (
    SELECT COUNT(*) AS total_rentals
    FROM drone.rental
    WHERE rent_in_dt IS NOT NULL
),
customer_summary AS (
    SELECT
        tc.cust_id,
        tc.customer_name,
        tc.courses_completed,
        NVL(cr.rentals_completed, 0) AS rentals_completed,
        ROUND(
            CASE
                WHEN tcr.total_rentals = 0 THEN 0
                ELSE (NVL(cr.rentals_completed, 0) / tcr.total_rentals) * 100
            END,
            1
        ) AS percent_value
    FROM trained_customers tc
    LEFT JOIN completed_rentals cr
        ON tc.cust_id = cr.cust_id
    CROSS JOIN total_completed_rentals tcr
)
SELECT
    cs.cust_id,
    cs.customer_name,
    cs.courses_completed,
    cs.rentals_completed,
    TO_CHAR(TRUNC(cs.percent_value))
        || '.'
        || TO_CHAR(TRUNC(MOD(cs.percent_value * 10, 10)))
        || '%' AS percent_all_rentals
FROM customer_summary cs
ORDER BY
    cs.cust_id;

SPOOL OFF
