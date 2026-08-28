package com.mayur.job.modal.embeddable;

import com.mayur.job.domain.SalaryPeriod;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.math.BigDecimal;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryRange {

    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    /**
     * ISO 4217 currency code, e.g. "USD", "INR", "EUR".
     */
    private String currency;

    @Enumerated(EnumType.STRING)
    private SalaryPeriod period;

    /**
     * Whether salary is open to negotiation.
     */
    private Boolean negotiable;

    /**
     * If false, salary is hidden from candidates ("Competitive" label shown).
     */
    private Boolean disclosed;
}
