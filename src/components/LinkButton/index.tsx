import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import React from "react";
import { Spinner } from "../Spinner";

export const LinkButtonVariant = {
  GREEN: "bg-green-300 hover:bg-green-400",
  ORANGE: "bg-amber-300 hover:bg-amber-400",
} as const;

export type LinkButtonVariant =
  (typeof LinkButtonVariant)[keyof typeof LinkButtonVariant];

interface BaseLinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

const BaseLinkButton = React.forwardRef<HTMLAnchorElement, BaseLinkButtonProps>(
  (
    {
      variant = LinkButtonVariant.GREEN,
      disabled = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const linkClassName = cn(
      className,
      "px-5 py-2 text-sm font-semibold rounded-full transition-all",
      {
        "hover:-translate-y-2 cursor-pointer": !disabled && !loading,
        "opacity-50 cursor-not-allowed": disabled,
        "opacity-75 cursor-wait": loading,
      },
      variant,
    );

    return (
      <a ref={ref} {...props} className={linkClassName}>
        {loading ? <Spinner /> : children}
      </a>
    );
  },
);

BaseLinkButton.displayName = "BaseLinkButton";

const CreatedLinkButton = createLink(BaseLinkButton);

export const LinkButton: LinkComponent<typeof BaseLinkButton> = (props) => {
  return <CreatedLinkButton {...props} />;
};
