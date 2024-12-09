const GripLines = ({ ...props }) => {
  return (
    <svg {...props}>
      <path
        d="M 0 1.5  C 0 2.2870312499999996  0.6191826923076925 3  1.384615384615385 3  L 16.615384615384617 3  C 17.380817307692308 3  18 2.3287500000000003  18 1.5  C 18 0.6712499999999997  17.380817307692308 0.042187500000000266  16.615384615384617 0  L 1.384615384615385 0  C 0.6191826923076925 0.042187500000000266  0 0.7129687500000004  0 1.5  Z M 18 10.457812500000001  C 18 9.6290625  17.381249999999998 9  16.615384615384617 9  L 1.384615384615385 9  C 0.6191826923076925 9  0 9.670781250000001  0 10.457812500000001  C 0 11.244843750000001  0.6191826923076926 11.957812500000001  1.384615384615385 12  L 16.615384615384617 12  C 17.380817307692308 11.957812500000001  18 11.286562500000002  18 10.457812500000001  Z "
        fillRule="nonzero"
        fill="#666666"
        stroke="none"
        transform="translate(11, 8)"
      />
    </svg>
  );
};

export default GripLines;